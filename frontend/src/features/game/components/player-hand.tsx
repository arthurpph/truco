import { motion } from 'framer-motion';
import PlayingCard from './playing-card';
import { CardDTO } from '../../../types/dtos';

interface PlayerHandProps {
    cards: CardDTO[];
    onCardClick: (card: CardDTO) => void;
    isMyTurn: boolean;
}

const PlayerHand: React.FC<PlayerHandProps> = ({
    cards,
    onCardClick,
    isMyTurn,
}) => {
    return (
        <motion.div
            className="flex gap-4 justify-center items-end"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            {cards.map((card, index) => (
                <motion.div
                    key={`${card.card}-${card.suit}-${index}`}
                    initial={{ y: 50, opacity: 0, rotate: -10 }}
                    animate={{
                        y: 0,
                        opacity: 1,
                        rotate: (index - 1) * 5,
                    }}
                    transition={{
                        duration: 0.4,
                        delay: 0.5 + index * 0.1,
                        type: 'spring',
                        stiffness: 100,
                    }}
                >
                    <PlayingCard
                        card={card}
                        onClick={() => isMyTurn && onCardClick(card)}
                        isSelectable={isMyTurn}
                        animate={false}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default PlayerHand;
