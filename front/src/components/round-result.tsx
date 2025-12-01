import { motion, AnimatePresence } from 'framer-motion';
import { RoundEndedDTO } from '../types/dtos';

interface RoundResultProps {
    isVisible: boolean;
    roundData: RoundEndedDTO | null;
}

const RoundResult: React.FC<RoundResultProps> = ({ isVisible, roundData }) => {
    if (!roundData) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/80 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Result Modal */}
                    <motion.div
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
                        initial={{ scale: 0, y: -100, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0, y: 100, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 150,
                            damping: 15,
                        }}
                    >
                        <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-3xl shadow-2xl border-8 border-amber-600 p-12 min-w-[500px]">
                            {roundData.draw ? (
                                <motion.div
                                    initial={{ rotate: -10 }}
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{
                                        duration: 0.5,
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                    }}
                                >
                                    <h2 className="text-6xl font-black text-amber-400 text-center mb-4">
                                        EMPATE!
                                    </h2>
                                    <p className="text-2xl text-amber-200 text-center">
                                        Ninguém ganhou esta rodada
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        repeatDelay: 0.5,
                                    }}
                                >
                                    <h2 className="text-6xl font-black text-amber-400 text-center mb-4">
                                        RODADA ENCERRADA!
                                    </h2>
                                    <p className="text-3xl text-amber-200 text-center font-bold">
                                        Time {roundData.teamWinner?.id} ganhou!
                                    </p>
                                </motion.div>
                            )}

                            {/* Cards display */}
                            <div className="mt-8 flex justify-center gap-4 flex-wrap">
                                {roundData.cardsPlayed.map((played, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border-2 border-amber-500/50"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <p className="text-sm text-amber-300 mb-1">
                                            Time {played.team.id}
                                        </p>
                                        <p className="text-xl font-bold text-white">
                                            {played.card.card.toUpperCase()}{' '}
                                            {played.card.suit}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.p
                                className="text-center text-amber-300 mt-6 text-lg"
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                }}
                            >
                                Próxima rodada começando...
                            </motion.p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RoundResult;
