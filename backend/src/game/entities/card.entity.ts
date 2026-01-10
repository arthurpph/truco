import { IsIn, IsNumber } from 'class-validator';

const MANILHAS = {
    zap: 10,
    copas: 9,
    espadas: 8,
    ouros: 7,
    coringa: 6,
} as const;
const SUITS = ['copas', 'espadas', 'ouros', 'paus'] as const;
const CARDS = { Q: 0, J: 1, K: 2, A: 3, '2': 4, '3': 5 } as const;

const cardKeys = Object.keys(CARDS) as (keyof typeof CARDS)[];
const manilhaKeys = Object.keys(MANILHAS) as (keyof typeof MANILHAS)[];

export class Card {
    @IsIn([...Object.keys(CARDS), ...Object.keys(MANILHAS)])
    card: keyof typeof CARDS | keyof typeof MANILHAS;

    @IsIn([...SUITS, 'manilha'])
    suit: (typeof SUITS)[number] | 'manilha';

    @IsNumber()
    value: number;
}

export const DECK: Card[] = [
    ...Array.from({ length: SUITS.length * cardKeys.length }, (_, i): Card => {
        const key = cardKeys[i % cardKeys.length];
        return {
            card: key,
            suit: SUITS[Math.floor(i / cardKeys.length)],
            value: CARDS[key],
        };
    }),
    ...manilhaKeys.map(
        (m): Card => ({
            card: m,
            suit: 'manilha',
            value: MANILHAS[m],
        }),
    ),
];
