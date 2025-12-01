import { motion, AnimatePresence } from 'framer-motion';

interface TrucoWaitingProps {
    isOpen: boolean;
    playerToName: string;
    points: number;
}

const TrucoWaiting: React.FC<TrucoWaitingProps> = ({
    isOpen,
    playerToName,
    points,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 20,
                        }}
                    >
                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-2xl border-8 border-amber-700 p-10 min-w-[450px]">
                            <motion.h2
                                className="text-5xl font-black text-emerald-950 text-center mb-4"
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                }}
                            >
                                TRUCO!
                            </motion.h2>

                            <p className="text-xl text-emerald-900 text-center mb-6">
                                Você pediu{' '}
                                <span className="font-bold">
                                    {points} pontos
                                </span>
                            </p>

                            <motion.div
                                className="flex flex-col items-center gap-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <p className="text-lg text-emerald-800 text-center">
                                    Aguardando{' '}
                                    <span className="font-bold">
                                        {playerToName}
                                    </span>{' '}
                                    responder...
                                </p>

                                {/* Loading animation */}
                                <div className="flex gap-2 mt-2">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-4 h-4 bg-emerald-800 rounded-full"
                                            animate={{
                                                y: [0, -12, 0],
                                                opacity: [0.5, 1, 0.5],
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                repeat: Infinity,
                                                delay: i * 0.15,
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Cards animation */}
                                <motion.div
                                    className="flex gap-3 mt-4"
                                    animate={{
                                        rotateY: [0, 10, -10, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                >
                                    {['♠', '♥', '♦', '♣'].map((suit, i) => (
                                        <motion.span
                                            key={suit}
                                            className={`text-3xl ${
                                                suit === '♥' || suit === '♦'
                                                    ? 'text-red-700'
                                                    : 'text-emerald-900'
                                            }`}
                                            animate={{
                                                scale: [1, 1.2, 1],
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                            }}
                                        >
                                            {suit}
                                        </motion.span>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TrucoWaiting;
