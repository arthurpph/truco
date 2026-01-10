import { motion, AnimatePresence } from 'framer-motion';
import ClickButton from '../../../components/click-button';

interface TrucoModalProps {
    isOpen: boolean;
    isRequest?: boolean;
    playerFromName?: string;
    points?: number;
    onAccept?: () => void;
    onReject?: () => void;
    onClose?: () => void;
}

const TrucoModal: React.FC<TrucoModalProps> = ({
    isOpen,
    isRequest = false,
    playerFromName,
    points,
    onAccept,
    onReject,
    onClose,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/70 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, rotate: 180, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 20,
                        }}
                    >
                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-2xl border-8 border-amber-700 p-8 min-w-[400px]">
                            {isRequest ? (
                                <>
                                    <motion.h2
                                        className="text-5xl font-black text-emerald-950 text-center mb-2"
                                        animate={{
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            repeat: Infinity,
                                            repeatDelay: 0.5,
                                        }}
                                    >
                                        TRUCO!
                                    </motion.h2>
                                    <p className="text-xl text-emerald-900 text-center mb-6">
                                        {playerFromName} pediu truco por{' '}
                                        <span className="font-bold">
                                            {points} pontos
                                        </span>
                                        !
                                    </p>
                                    <div className="flex gap-4 justify-center">
                                        <ClickButton
                                            name="ACEITAR"
                                            defaultStyles="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl px-8 py-4 rounded-lg transition-colors"
                                            onClick={onAccept}
                                        />
                                        <ClickButton
                                            name="REJEITAR"
                                            defaultStyles="bg-red-600 hover:bg-red-500 text-white font-bold text-xl px-8 py-4 rounded-lg transition-colors"
                                            onClick={onReject}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <motion.h2
                                        className="text-5xl font-black text-emerald-950 text-center mb-4"
                                        animate={{
                                            rotate: [0, -5, 5, -5, 5, 0],
                                        }}
                                        transition={{
                                            duration: 0.5,
                                        }}
                                    >
                                        TRUCO ACEITO!
                                    </motion.h2>
                                    <p className="text-2xl text-emerald-900 text-center font-bold">
                                        Rodada vale {points} pontos!
                                    </p>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TrucoModal;
