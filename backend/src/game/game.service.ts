import { Injectable } from '@nestjs/common';
import { Game } from './entities/game.entity';
import { Room } from 'src/room/entities/room.entity';
import { PlayerGame } from './entities/player-game.entity';
import { RoomService } from 'src/room/room.service';
import { Team, Teams } from 'src/shared/entities/team.entity';
import { Card } from './entities/card.entity';
import { AppGateway } from 'src/app.gateway';
import { TrucoAskedDtoOut } from './dtos/truco-asked.dto.out';
import { CardPlayedDtoOut } from './dtos/card-played.dto.out';
import { RoundEndedDtoOut } from './dtos/round-ended.dto.out';
import { RoundStartedDtoOut } from './dtos/round-started.dto.out';
import { RoundHistory } from './types/game.type';
import { GameInitializedDtoOut } from './dtos/game-initialized.dto.out';

type EventOut =
    | 'game:initialized'
    | 'game:cardplayed'
    | 'game:truco:asked'
    | 'game:truco:accepted'
    | 'game:truco:rejected'
    | 'game:roundended'
    | 'game:roundstarted';

@Injectable()
export class GameService {
    private games = new Map<string, Game>();

    constructor(
        private readonly roomService: RoomService,
        private readonly appGateway: AppGateway,
    ) {}

    create(room: Room): Game | null {
        const teams: Teams<PlayerGame> = [new Team(), new Team()];

        for (let i = 0; i < room.teams.length; i++) {
            const players = room.teams[i].players;
            for (const player of players) {
                if (!player) return null;
                teams[i].addPlayer(
                    new PlayerGame(player.id, player.name, player.socketId),
                );
            }
        }
        const game = new Game(room.id, teams);
        this.roomService.delete(room.id);
        this.games.set(game.id, game);
        game.shuffleAndGiveCards();

        this.broadcastStateUpdateBasedOnPlayerState(
            game,
            'game:initialized',
            (player) => {
                const gameInitializedDtoOut: GameInitializedDtoOut = {
                    gameId: game.id,
                    myPlayerId: player.id,
                    myHand: player.hand,
                    currentPlayer: game.getCurrentPlayer().toDto(),
                };
                return gameInitializedDtoOut;
            },
        );
        return game;
    }

    playCard(
        gameId: string,
        socketId: string,
        card: Card,
        isDark: boolean,
    ): void {
        const game = this.games.get(gameId);
        if (!game) return;
        const player = game.players.find((p) => p.socketId === socketId);
        if (!player) return;
        const playCardResult = game.playCard(player.id, card);
        if (!playCardResult) return;
        const { roundEnded } = playCardResult;
        const cardPlayedDtoOut: CardPlayedDtoOut = {
            isDark,
            ...(!isDark && { card }),
            playerId: player.id,
            currentPlayer: game.getCurrentPlayer().toDto(),
        } as CardPlayedDtoOut;
        this.broadcastStateUpdate(game, 'game:cardplayed', cardPlayedDtoOut);
        if (!roundEnded) return;
        this.handleRoundEnded(game, playCardResult);
    }

    askTruco(gameId: string, socketId: string): void {
        const game = this.games.get(gameId);
        if (!game) return;
        const player = game.players.find((p) => p.socketId === socketId);
        if (!player) return;
        if (game.getCurrentPlayer().id !== player.id) return;
        const trucoStatus = game.trucoAsk(player.id);
        if (!trucoStatus || !trucoStatus.onGoing) return;

        const playerFrom = game.players.find(
            (p) => p.id === trucoStatus.playerFrom,
        );
        const playerTo = game.players.find(
            (p) => p.id === trucoStatus.playerTo,
        );

        const dto: TrucoAskedDtoOut = {
            playerFrom: trucoStatus.playerFrom,
            playerFromName: playerFrom?.name || 'Jogador',
            playerTo: trucoStatus.playerTo,
            playerToName: playerTo?.name || 'Jogador',
            pointsInCaseOfAccept: trucoStatus.pointsInCaseOfAccept,
        };
        this.broadcastStateUpdate(game, 'game:truco:asked', dto);
    }

    acceptTruco(gameId: string, socketId: string): void {
        const game = this.games.get(gameId);
        if (!game) return;
        const player = game.players.find((p) => p.socketId === socketId);
        if (!player) return;
        if (game.getNextPlayerToPlay().id !== player.id) return;
        const trucoStatus = game.trucoAccept();
        if (!trucoStatus || trucoStatus.onGoing) return;
        this.broadcastStateUpdate(game, 'game:truco:accepted', null);
    }

    rejectTruco(gameId: string, socketId: string): void {
        const game = this.games.get(gameId);
        if (!game) return;
        const player = game.players.find((p) => p.socketId === socketId);
        if (!player) return;
        if (game.getNextPlayerToPlay().id !== player.id) return;
        const trucoStatus = game.trucoReject();
        if (!trucoStatus || trucoStatus.onGoing) return;
        this.broadcastStateUpdate(game, 'game:truco:rejected', null);
    }

    private broadcastStateUpdate(game: Game, event: EventOut, data: any) {
        for (const player of game.players) {
            const socket = this.appGateway.get(player.socketId);
            if (!socket) continue;
            socket.emit(event, data);
        }
    }

    private broadcastStateUpdateBasedOnPlayerState(
        game: Game,
        event: EventOut,
        callback: (player: PlayerGame) => any,
    ) {
        for (const player of game.players) {
            const socket = this.appGateway.get(player.socketId);
            if (!socket) continue;
            socket.emit(event, callback(player));
        }
    }

    private handleRoundEnded(
        game: Game,
        playCardResult: RoundHistory<PlayerGame>,
    ) {
        const { draw, cardsPlayed } = playCardResult;

        let roundEndedDtoOut: RoundEndedDtoOut;
        if (draw) {
            roundEndedDtoOut = { draw, cardsPlayed };
        } else {
            const { teamWinner } = playCardResult;
            roundEndedDtoOut = {
                draw,
                cardsPlayed,
                teamWinner,
            };
        }

        this.broadcastStateUpdate(game, 'game:roundended', roundEndedDtoOut);
        setTimeout(() => {
            game.startNewRound();

            this.broadcastStateUpdateBasedOnPlayerState(
                game,
                'game:roundstarted',
                (player) => {
                    const roundStartedDtoOut: RoundStartedDtoOut = {
                        currentPlayer: game.getCurrentPlayer().toDto(),
                        myHand: player.hand,
                    };
                    return roundStartedDtoOut;
                },
            );
        }, 5000);
    }
}
