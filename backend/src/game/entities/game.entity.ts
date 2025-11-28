import { Team, Teams } from 'src/shared/entities/team.entity';
import { PlayerGame } from './player-game.entity';
import { Card, DECK } from './card.entity';
import {
    RoundHistory,
    RoundStatus,
    RoundValues,
    TrucoPoints,
    TrucoStatus,
} from '../types/game.type';

export class Game {
    id: string;
    players: PlayerGame[];
    startedAt: Date;

    private teams: Teams<PlayerGame>;
    private roundStatus: RoundStatus;
    private roundHistory: RoundHistory<PlayerGame>[];
    private currentPlayerIndexRound: number;
    private currentPlayerIndex: number;
    private currentRoundCounter: number;
    private currentRoundValue: RoundValues;
    private trucoStatus: TrucoStatus = { onGoing: false };

    constructor(id: string, teams: Teams<PlayerGame>) {
        this.id = id;
        this.teams = teams;
        this.roundStatus = { onGoing: true, roundNumber: 1, cardsPlayed: [] };
        this.roundHistory = [];
        this.currentPlayerIndexRound = 0;
        this.currentPlayerIndex = 0;
        this.currentRoundCounter = 0;
        this.currentRoundValue = 1;
        this.trucoStatus = { onGoing: false };
        this.startedAt = new Date();
        this.players = [];
        const teamSize = teams[0].length;
        for (let j = 0; j < teamSize; j++) {
            for (let i = 0; i < teams.length; i++) {
                this.players.push(teams[i][j]);
            }
        }
    }

    playCard(
        playerId: string,
        card: Card,
    ):
        | { roundEnded: false }
        | ({ roundEnded: true } & RoundHistory<PlayerGame>)
        | null {
        if (this.getCurrentPlayer().id !== playerId) return null;
        const player = this.players.find((p) => p.id === playerId);
        if (!player) return null;
        const updatedHand = player.playCard(card);
        if (!updatedHand) return null;
        this.roundStatus.cardsPlayed.push(card);
        this.advanceCurrentPlayer();
        if (this.checkIfRoundEnded()) {
            const roundHistoryData = this.roundEnded();
            return { roundEnded: true, ...roundHistoryData };
        }
        return { roundEnded: false };
    }

    // based on Fisher–Yates algorithm
    shuffleAndGiveCards(): void {
        this.players.forEach((p) => p.clearHand());
        const deckCopy = [...DECK];
        for (let i = deckCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deckCopy[i], deckCopy[j]] = [deckCopy[j], deckCopy[i]];
        }

        const cardsPerPlayer = 3;
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].hand = deckCopy.slice(
                i * cardsPerPlayer,
                (i + 1) * cardsPerPlayer,
            );
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
        if (this.getCurrentPlayer().id !== playerId) return null;
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
        this.roundEnded();
        return this.trucoStatus;
    }

    getCurrentPlayer(): PlayerGame {
        return this.players[this.currentPlayerIndex];
    }

    startNewRound(): void {
        this.roundStatus.onGoing = true;
        this.roundStatus.cardsPlayed = [];
        this.currentRoundCounter = 0;
    }

    private roundEnded(): RoundHistory<PlayerGame> {
        const teamWinner = this.checkRoundWinner();
        const roundHistoryData: RoundHistory<PlayerGame> = {
            draw: teamWinner === undefined,
            roundNumber: this.roundStatus.roundNumber,
            cardsPlayed: this.roundStatus.cardsPlayed,
            ...(teamWinner ? { teamWinner } : {}),
        } as RoundHistory<PlayerGame>;
        this.roundHistory.push(roundHistoryData);
        this.resetRoundStatus();
        this.currentPlayerIndexRound =
            (this.currentPlayerIndexRound + 1) % this.players.length;
        this.currentPlayerIndex = this.currentPlayerIndexRound;
        this.trucoStatus = { onGoing: false };
        this.currentRoundValue = 1;
        this.currentRoundCounter = 0;
        return roundHistoryData;
    }

    private advanceCurrentPlayer(): void {
        const nextPlayerIndex =
            (this.currentPlayerIndex + 1) % this.players.length;
        this.currentPlayerIndex = nextPlayerIndex;
        this.currentRoundCounter += 1;
    }

    private checkIfRoundEnded(): boolean {
        return this.currentRoundCounter >= this.players.length;
    }

    private resetRoundStatus(): void {
        this.roundStatus.onGoing = false;
        this.roundStatus.roundNumber += 1;
        this.roundStatus.cardsPlayed = [];
    }

    // it returns null if there was invalid data or undefined means there was a draw
    private checkRoundWinner(): Team<PlayerGame> | null | undefined {
        // TODO
        return undefined;
    }
}
