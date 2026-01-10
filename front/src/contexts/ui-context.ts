import { createContext, useContext } from 'react';

type GameBackgroundContextType = {
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
    setDefaultBackgroundColor: () => void;
    username: string;
    setUsername: (username: string) => void;
};

export const GameBackgroundContext = createContext<
    GameBackgroundContextType | undefined
>(undefined);

export const useGameBackgroundContext = () => {
    const context = useContext(GameBackgroundContext);

    if (!context) {
        throw new Error(
            'useGameBackgroundContext must be used within a GameBackgroundProvider',
        );
    }

    return context;
};
