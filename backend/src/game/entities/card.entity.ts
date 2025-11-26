const MANILHAS = ['zap', 'copas', 'espadas', 'ouros', 'coringa'] as const;
const SUITS = ['copas', 'espadas', 'ouros', 'paus'] as const;
const VALUES = ['Q', 'J', 'K', 'A', '2', '3'] as const;

export type Card = {
    suit: (typeof SUITS)[number] | 'manilha';
    value: (typeof VALUES)[number] | (typeof MANILHAS)[number];
};

export const DECK: Card[] = [
    ...Array.from(
        { length: SUITS.length * VALUES.length },
        (_, i): Card => ({
            suit: SUITS[Math.floor(i / VALUES.length)],
            value: VALUES[i % VALUES.length],
        }),
    ),
    ...MANILHAS.map(
        (m): Card => ({
            suit: 'manilha',
            value: m,
        }),
    ),
];
