import { useEffect, useState } from 'react';
import Home from '../home/Home';
import { GameBackgroundContext } from '../../contexts/game-context';

const Game = () => {
    const [backgroundColor, setBackgroundColor] = useState<string>('bg-orange');
    const [username, setUsername] = useState<string>('');

    const setDefaultBackgroundColor = () => {
        setBackgroundColor('bg-orange');
    };

    useEffect(() => {
        document.body.classList.add(
            'h-screen',
            'bg-gradient-to-b',
            'from-emerald-900',
            'to-emerald-950',
        );

        return () => {
            document.body.classList.remove(
                'h-screen',
                'bg-gradient-to-b',
                'from-emerald-900',
                'to-emerald-950',
            );
        };
    }, []);

    return (
        <GameBackgroundContext.Provider
            value={{
                backgroundColor,
                setBackgroundColor,
                setDefaultBackgroundColor,
                username,
                setUsername,
            }}
        >
            <div className="w-full h-full flex items-center justify-center p-8">
                <div className="w-[90vw] h-[90vh] bg-emerald-800/30 backdrop-blur-sm rounded-3xl border-2 border-emerald-700/50 shadow-2xl overflow-hidden">
                    <Home />
                </div>
            </div>
        </GameBackgroundContext.Provider>
    );
};

export default Game;
