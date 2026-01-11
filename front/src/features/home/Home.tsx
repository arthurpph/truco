import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameBackgroundContext } from '../../contexts/ui-context';
import RoomsList from '../room/rooms-list/rooms-list';
import AnimatedPage from './components/animated-page';
import { authAdapter } from './adapters/auth.adapter';
import getSocketConnection from '@/lib/socket-connection';
import { AuthResponseDTO } from '@/types/dtos';

const Home = () => {
    const { setUsername: setContextUsername } = useGameBackgroundContext();

    const [showRoomsComponent, setShowRoomsComponent] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const socket = getSocketConnection();

    const handleAuthClick = async () => {
        if (username.trim() === '' || password.trim() === '') {
            setError(true);
            return;
        }
        let authResponse;
        try {
            authResponse = await handleAuth();
        } catch {
            return;
        }
        setContextUsername(authResponse.username.trim());
        setShowRoomsComponent(true);
    };

    const handleAuth = async (): Promise<AuthResponseDTO> => {
        const authResponse = await authAdapter.authenticate(username, password);
        socket.startConnection(authResponse.token);
        localStorage.setItem('auth-token', authResponse.token);
        return authResponse;
    };

    const handleUsernameInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setUsername(e.target.value);
        setError(false);
    };

    const handlePasswordInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setPassword(e.target.value);
        setError(false);
    };

    useEffect(() => {
        const checkActiveToken = async () => {
            const tokenStorageKey = 'auth-token';
            const token = localStorage.getItem(tokenStorageKey);
            if (!token) return;
            try {
                const isTokenValid = await authAdapter.verifyToken(token);
                if (!isTokenValid) {
                    localStorage.removeItem(tokenStorageKey);
                    return;
                }
            } catch {
                return;
            }
            socket.startConnection(token);
            setShowRoomsComponent(true);
        };

        checkActiveToken();
    }, []);

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
                                            onChange={handleUsernameInputChange}
                                            onKeyDown={(e) =>
                                                e.key === 'Enter' &&
                                                handleAuthClick()
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

                                    <div className="mb-5">
                                        <label className="block text-amber-100 text-sm mb-2 font-medium">
                                            Senha
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={handlePasswordInputChange}
                                            onKeyDown={(e) =>
                                                e.key === 'Enter' &&
                                                handleAuthClick()
                                            }
                                            placeholder="Digite sua senha"
                                            className={`w-full h-14 px-4 bg-emerald-950/60 text-white text-lg rounded-lg
                        border-2 ${
                            error ? 'border-red-500' : 'border-emerald-600/50'
                        }
                        focus:border-amber-500 focus:outline-none transition-colors
                        placeholder:text-emerald-600`}
                                        />
                                        {error && (
                                            <p className="text-red-400 text-xs mt-2">
                                                Por favor, insira sua senha
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleAuthClick}
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
