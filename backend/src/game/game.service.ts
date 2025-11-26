import { Injectable } from '@nestjs/common';
import { Game } from './entities/game.entity';
import { Room } from 'src/room/entities/room.entity';
import { PlayerGame } from './entities/player-game.entity';
import { RoomService } from 'src/room/room.service';
import { Team } from 'src/shared/entities/team.entity';
import { Card } from './entities/card.entity';
import { AppGateway } from 'src/app.gateway';

type EventOut = 'game:cardplayed' | 'game:truco:asked';

@Injectable()
export class GameService {
    private games = new Map<string, Game>();

    constructor(
        private readonly roomService: RoomService,
        private readonly appGateway: AppGateway,
    ) {}

    create(room: Room): Game | null {
        const teams: Team<PlayerGame> = new Array(2) as Team<PlayerGame>;

        for (let i = 0; i < room.teams.length; i++) {
            for (let j = 0; j < room.teams[i].length; j++) {
                const player = room.teams[i][j];
                if (!player) {
                    return null;
                }
                const playerGame = new PlayerGame(player.id, player.name);
                teams[i][j] = playerGame;
            }
        }
        const game = new Game(room.id, teams);
        this.roomService.delete(room.id);
        this.games.set(game.id, game);
        game.shuffleAndGiveCards();
        return game;
    }

    playCard(
        gameId: string,
        playerId: string,
        card: Card,
        isDark: boolean,
    ): void {
        const game = this.games.get(gameId);
        if (!game) return;
        game.playCard(playerId, card);
        this.broadcastStateUpdate(game, 'game:cardplayed', {
            ...(isDark ? { isDark } : { card }), // only send the card if not dark, otherwise it could easily be cheated by the client
            playerId,
            currentPlayer: game?.currentPlayer,
        });
    }

    askTruco(gameId: string, playerId: string): void {
        const game = this.games.get(gameId);
        if (!game) return;
        if (game.currentPlayer !== playerId) return;
        const whoShouldAnswerPlayer = game.getNextPlayerToPlay();
        this.broadcastStateUpdate(game, 'game:truco:asked', {
            from: playerId,
            to: whoShouldAnswerPlayer.id,
        });
    }

    private broadcastStateUpdate(game: Game, event: EventOut, data: any) {
        for (const player of game.players) {
            const socket = this.appGateway.get(player.id);
            if (!socket) continue;
            socket.emit(event, data);
        }
    }
}
