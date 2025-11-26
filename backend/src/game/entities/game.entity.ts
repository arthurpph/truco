import { Team } from 'src/shared/entities/team.entity';
import { PlayerGame } from './player-game.entity';
import { Card, DECK } from './card.entity';

export class Game {
    id: string;
    players: PlayerGame[];
    teams: Team<PlayerGame>;
    roundNumber: number;
    currentPlayer: string;
    cardsPlayedOnRound: null;
    points: number;
    startedAt: Date;

    constructor(id: string, teams: Team<PlayerGame>) {
        this.id = id;
        this.teams = teams;
        this.roundNumber = 1;
        this.currentPlayer = teams[0][0].id;
        this.cardsPlayedOnRound = null;
        this.points = 1;
        this.startedAt = new Date();
        this.players = [];
        for (let i = 0; i < teams.length; i++) {
            for (let j = 0; j < teams[i].length; j++) {
                this.players.push(teams[i][j]);
            }
        }
    }

    playCard(playerId: string, card: Card): Game | null {
        const player = this.players.find((p) => p.id === playerId);
        if (!player) return null;
        const cardIndex = player.hand.findIndex(
            (c) => c.suit === card.suit && c.value === card.value,
        );
        if (cardIndex === -1) return null;
        player.hand.splice(cardIndex, 1);
        this.advanceCurrentPlayer();
        return this;
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
        const currentPlayerIndex = this.getCurrentPlayerIndex();
        return this.players[(currentPlayerIndex + 1) % this.players.length];
    }

    private advanceCurrentPlayer(): void {
        const currentPlayerIndex = this.getCurrentPlayerIndex();
        this.currentPlayer =
            this.players[(currentPlayerIndex + 1) % this.players.length].id;
    }

    private getCurrentPlayerIndex(): number {
        return this.players.findIndex((p) => p.id === this.currentPlayer);
    }
}
