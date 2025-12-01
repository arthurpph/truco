import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameBackgroundContext } from '../../contexts/game-context';
import RoomsList from '../room/rooms-list/rooms-list';

const AnimatedPage = ({
    children,
    startDirection,
}: {
    children: React.ReactNode;
    startDirection: string;
}) => {
    const variants = {
        initial: {
            x: startDirection === 'left' ? -100 : 100,
            opacity: 0,
        },
        animate: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.4 },
        },
        exit: {
            x: startDirection === 'left' ? 100 : -100,
            opacity: 0,
            transition: { duration: 0.3 },
        },
    };

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};

const Home = () => {
    const { setUsername: setContextUsername } = useGameBackgroundContext();

    const [showRoomsComponent, setShowRoomsComponent] = useState(false);
    const [username, setUsername] = useState('');
    const [error, setError] = useState(false);

    const handlePlayClick = () => {
        if (username.trim() === '') {
            setError(true);
            return;
        }
        setContextUsername(username.trim());
        setShowRoomsComponent(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setError(false);
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 opacity-5 text-white/20">
                <div className="absolute top-12 left-16 text-8xl rotate-12">
                    ♠
                </div>
                <div className="absolute top-24 right-24 text-7xl -rotate-12">
                    ♦
                </div>
                <div className="absolute bottom-16 left-24 text-8xl -rotate-6">
                    ♣
                </div>
                <div className="absolute bottom-24 right-16 text-7xl rotate-6">
                    ♥
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!showRoomsComponent ? (
                    <AnimatedPage key="home" startDirection="left">
                        <div className="flex items-center justify-center w-full h-full">
                            <div className="flex flex-col items-center gap-6 w-full max-w-md px-6">
                                <div className="text-center mb-2">
                                    <h1 className="text-6xl font-black text-amber-400 tracking-tight mb-1">
                                        TRUCO
                                    </h1>
                                    <div className="text-amber-200 text-sm tracking-widest font-semibold">
                                        CARIOCA
                                    </div>
                                </div>

                                <div className="w-full bg-emerald-900/40 backdrop-blur-sm p-8 rounded-2xl border border-emerald-700/50">
                                    <div className="mb-5">
                                        <label className="block text-amber-100 text-sm mb-2 font-medium">
                                            Nome do jogador
                                        </label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={handleInputChange}
                                            onKeyPress={(e) =>
                                                e.key === 'Enter' &&
                                                handlePlayClick()
                                            }
                                            placeholder="Digite seu nome"
                                            className={`w-full h-14 px-4 bg-emerald-950/60 text-white text-lg rounded-lg
                        border-2 ${
                            error ? 'border-red-500' : 'border-emerald-600/50'
                        }
                        focus:border-amber-500 focus:outline-none transition-colors
                        placeholder:text-emerald-600`}
                                        />
                                        {error && (
                                            <p className="text-red-400 text-xs mt-2">
                                                Por favor, insira seu nome
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        onClick={handlePlayClick}
                                        className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-emerald-950 
                      font-bold text-lg rounded-lg transition-colors uppercase tracking-wide"
                                    >
                                        Entrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </AnimatedPage>
                ) : (
                    <AnimatedPage key="rooms" startDirection="right">
                        <RoomsList />
                    </AnimatedPage>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
