import { motion } from 'framer-motion';
import { CardDTO } from '../types/dtos';

interface PlayingCardProps {
    card: CardDTO;
    onClick?: () => void;
    isSelectable?: boolean;
    isDark?: boolean;
    animate?: boolean;
    position?: { x: number; y: number };
    delay?: number;
}

const getSuitSymbol = (suit: string): string => {
    switch (suit) {
        case 'copas':
            return '♥';
        case 'espadas':
            return '♠';
        case 'ouros':
            return '♦';
        case 'paus':
            return '♣';
        case 'manilha':
            return '★';
        default:
            return '';
    }
};

const getSuitColor = (suit: string): string => {
    if (suit === 'copas' || suit === 'ouros') {
        return 'text-red-600';
    }
    if (suit === 'manilha') {
        return 'text-yellow-500';
    }
    return 'text-gray-900';
};

const getCardDisplay = (card: string): string => {
    if (card === 'zap' || card === 'coringa') return card.toUpperCase();
    return card.toUpperCase();
};

const PlayingCard: React.FC<PlayingCardProps> = ({
    card,
    onClick,
    isSelectable = false,
    isDark = false,
    animate = true,
    position,
    delay = 0,
}) => {
    const cardVariants = {
        hidden: {
            opacity: 0,
            scale: 0.5,
            rotateY: 180,
        },
        visible: {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
                duration: 0.5,
                delay,
                type: 'spring',
                stiffness: 100,
            },
        },
        hover: isSelectable
            ? {
                  y: -30,
                  scale: 1.15,
                  rotateZ: 2,
                  transition: {
                      duration: 0.2,
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                  },
              }
            : {},
        tap: isSelectable ? { scale: 0.95, y: -15 } : {},
    };

    const cardContent = isDark ? (
        <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-lg border-4 border-amber-600 flex items-center justify-center">
            <div className="text-5xl text-amber-400">🂠</div>
        </div>
    ) : (
        <div className="w-full h-full bg-white rounded-lg border-4 border-gray-800 shadow-2xl flex flex-col items-center justify-between p-2">
            <div className="flex flex-col items-center leading-none">
                <span
                    className={`text-lg font-bold ${getSuitColor(card.suit)}`}
                >
                    {getCardDisplay(card.card)}
                </span>
                <span className={`text-xl ${getSuitColor(card.suit)}`}>
                    {getSuitSymbol(card.suit)}
                </span>
            </div>
            <div className={`text-3xl ${getSuitColor(card.suit)}`}>
                {getSuitSymbol(card.suit)}
            </div>
            <div className="flex flex-col items-center rotate-180 leading-none">
                <span
                    className={`text-lg font-bold ${getSuitColor(card.suit)}`}
                >
                    {getCardDisplay(card.card)}
                </span>
                <span className={`text-xl ${getSuitColor(card.suit)}`}>
                    {getSuitSymbol(card.suit)}
                </span>
            </div>
        </div>
    );

    return (
        <motion.div
            className={`w-28 h-40 overflow-hidden rounded-lg ${isSelectable ? 'cursor-pointer hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:ring-4 hover:ring-amber-400/50' : ''} transition-shadow duration-200`}
            variants={animate ? cardVariants : undefined}
            initial={animate ? 'hidden' : undefined}
            animate={animate ? 'visible' : { x: position?.x, y: position?.y }}
            whileHover={isSelectable ? 'hover' : undefined}
            whileTap={isSelectable ? 'tap' : undefined}
            onClick={onClick}
            style={{
                transformStyle: 'preserve-3d',
            }}
        >
            {cardContent}
        </motion.div>
    );
};

export default PlayingCard;
