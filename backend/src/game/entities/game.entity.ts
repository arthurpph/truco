import { Team, Teams } from 'src/shared/entities/team.entity';
import { PlayerGame } from './player-game.entity';
import { Card, DECK } from './card.entity';
import {
    Round,
    RoundValues,
    TrucoPoints,
    TrucoStatus,
} from '../types/game.type';

export class Game {
    id: string;
    players: PlayerGame[];
    teams: Teams<PlayerGame>;
    roundNumber: number;
    roundHistory: Round<PlayerGame>[];
    currentPlayerIndexRound: number;
    currentPlayerIndex: number;
    currentPlayer: string;
    currentRoundCounter: number;
    cardsPlayedOnRound: Card[];
    currentRoundValue: RoundValues;
    trucoStatus: TrucoStatus = { onGoing: false };
    startedAt: Date;

    constructor(id: string, teams: Teams<PlayerGame>) {
        this.id = id;
        this.teams = teams;
        this.roundNumber = 1;
        this.roundHistory = [];
        this.currentPlayerIndexRound = 0;
        this.currentPlayerIndex = 0;
        this.currentPlayer = teams[0][0].id;
        this.currentRoundCounter = 0;
        this.cardsPlayedOnRound = [];
        this.currentRoundValue = 1;
        this.trucoStatus = { onGoing: false };
        this.startedAt = new Date();
        this.players = [];
        for (let i = 0; i < teams.length; i++) {
            for (let j = 0; j < teams[i].length; j++) {
                this.players.push(teams[i][j]);
            }
        }
    }

    playCard(
        playerId: string,
        card: Card,
    ):
        | { roundEnded: false }
        | ({ roundEnded: true } & Round<PlayerGame>)
        | null {
        const player = this.players.find((p) => p.id === playerId);
        if (!player) return null;
        const updatedHand = player.playCard(card);
        if (!updatedHand) return null;
        this.advanceCurrentPlayer();
        if (this.checkIfRoundEnded()) {
            const roundHistoryData = this.nextRound();
            return { roundEnded: true, ...roundHistoryData };
        }
        return { roundEnded: false };
    }

    shuffleAndGiveCards(): void {
        const used = new Set<Card>();
        for (let i = 0; i < 4 * 3; i++) {
            let card = DECK[Math.floor(Math.random() * DECK.length)];
            while (used.has(card)) {
                card = DECK[Math.floor(Math.random() * DECK.length)];
            }
            used.add(card);
            const playerIndex = i % 4;
            const teamIndex = playerIndex % 2;
            const playerOnTeamIndex = Math.floor(playerIndex / 2);
            this.teams[teamIndex][playerOnTeamIndex].hand.push(card);
        }
    }

    getNextPlayerToPlay(): PlayerGame {
        return this.players[
            (this.currentPlayerIndex + 1) % this.players.length
        ];
    }

    getNextTrucoPoints(): -1 | TrucoPoints {
        const trucoPointsSequence = [1, 3, 6, 9, 12];
        const currentIndex = trucoPointsSequence.indexOf(
            this.currentRoundValue,
        );
        if (
            currentIndex === -1 ||
            currentIndex === trucoPointsSequence.length - 1
        ) {
            return -1;
        }
        return trucoPointsSequence[currentIndex + 1] as 3 | 6 | 9 | 12;
    }

    trucoAsk(playerId: string): TrucoStatus | null {
        const nextTrucoPoints = this.getNextTrucoPoints();
        if (this.currentPlayer !== playerId) return null;
        if (nextTrucoPoints === -1) return null;
        this.trucoStatus = {
            onGoing: true,
            playerFrom: playerId,
            playerTo: this.getNextPlayerToPlay().id,
            pointsInCaseOfAccept: nextTrucoPoints,
        };
        return this.trucoStatus;
    }

    trucoAccept(): TrucoStatus | null {
        const nextTrucoPoints = this.getNextTrucoPoints();
        if (nextTrucoPoints === -1) return null;
        this.currentRoundValue = nextTrucoPoints;
        this.trucoStatus = { onGoing: false };
        return this.trucoStatus;
    }

    trucoReject(): TrucoStatus | null {
        if (!this.trucoStatus.onGoing) return null;
        this.trucoStatus = { onGoing: false };
        this.nextRound();
        return this.trucoStatus;
    }

    private nextRound(): Round<PlayerGame> {
        const teamWinner = this.checkRoundWinner();
        const roundHistoryData: Round<PlayerGame> = {
            draw: teamWinner === undefined,
            roundNumber: this.roundNumber,
            cardsPlayed: this.cardsPlayedOnRound,
            ...(teamWinner ? { teamWinner } : {}),
        } as Round<PlayerGame>;
        this.roundHistory.push(roundHistoryData);
        this.roundNumber += 1;
        this.cardsPlayedOnRound = [];
        this.currentPlayerIndexRound =
            (this.currentPlayerIndexRound + 1) % this.players.length;
        this.currentPlayerIndex = this.currentPlayerIndexRound;
        this.trucoStatus = { onGoing: false };
        this.currentRoundValue = 1;
        return roundHistoryData;
    }

    private advanceCurrentPlayer(): void {
        const nextPlayerIndex =
            (this.currentPlayerIndex + 1) % this.players.length;
        this.currentPlayer = this.players[nextPlayerIndex].id;
        this.currentPlayerIndex = nextPlayerIndex;
        this.currentRoundCounter += 1;
    }

    private checkIfRoundEnded(): boolean {
        return this.currentRoundCounter >= this.players.length;
    }

    // it returns null if there was invalid data or undefined means there was a draw
    private checkRoundWinner(): Team<PlayerGame> | null | undefined {
        // TODO
        return undefined;
    }
}
