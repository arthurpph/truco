import { motion, AnimatePresence } from 'framer-motion';
import PlayingCard from './playing-card';
import { CardDTO } from '../../../types/dtos';

interface GameBoardProps {
    playedCards: Array<{ playerId: string; card?: CardDTO; isDark: boolean }>;
    roundValue: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ playedCards, roundValue }) => {
    const getCardPosition = (index: number) => {
        const positions = [
            { x: -80, y: -20, rotation: -15 },
            { x: 80, y: -20, rotation: 15 },
            { x: -80, y: 40, rotation: -10 },
            { x: 80, y: 40, rotation: 10 },
        ];
        return positions[index] || { x: 0, y: 0, rotation: 0 };
    };

    return (
        <div className="relative flex items-center justify-center h-96">
            {/* Mesa central */}
            <motion.div
                className="absolute w-[500px] h-[300px] bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl shadow-2xl border-8 border-amber-700"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Valor da rodada */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <motion.div
                        className="bg-amber-500 text-emerald-950 font-black text-3xl px-6 py-2 rounded-full shadow-lg border-4 border-amber-600"
                        key={roundValue}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 10,
                        }}
                    >
                        {roundValue} {roundValue === 1 ? 'PONTO' : 'PONTOS'}
                    </motion.div>
                </div>

                {/* Cartas jogadas */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <AnimatePresence>
                        {playedCards.map((played, index) => {
                            const pos = getCardPosition(index);
                            return (
                                <motion.div
                                    key={`${played.playerId}-${index}`}
                                    initial={{
                                        x: 0,
                                        y: -200,
                                        opacity: 0,
                                        rotate: 0,
                                    }}
                                    animate={{
                                        x: pos.x,
                                        y: pos.y,
                                        opacity: 1,
                                        rotate: pos.rotation,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0,
                                        transition: { duration: 0.3 },
                                    }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 150,
                                        damping: 15,
                                        delay: index * 0.1,
                                    }}
                                    className="absolute"
                                >
                                    {played.card && (
                                        <PlayingCard
                                            card={played.card}
                                            isDark={played.isDark}
                                            animate={false}
                                        />
                                    )}
                                    {played.isDark && !played.card && (
                                        <PlayingCard
                                            card={{
                                                card: '',
                                                suit: 'paus',
                                                value: 0,
                                            }}
                                            isDark={true}
                                            animate={false}
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default GameBoard;
