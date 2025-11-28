import { Player } from 'src/player/entities/player.entity';
import { Card } from './card.entity';

export class PlayerGame extends Player {
    hand: Card[] = [];

    playCard(card: Card): Card[] | null {
        const cardIndex = this.hand.findIndex(
            (c) => c.suit === card.suit && c.value === card.value,
        );
        if (cardIndex === -1) return null;
        this.hand.splice(cardIndex, 1);
        return this.hand;
    }

    clearHand(): void {
        this.hand = [];
    }
}
