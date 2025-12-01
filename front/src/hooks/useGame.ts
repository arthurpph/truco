import { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import getSocketConnection from '../lib/socket-connection';
import {
    CardDTO,
    CardPlayedDTO,
    PlayerDTO,
    RoundEndedDTO,
    RoundStartedDTO,
    TrucoAskedDTO,
} from '../types/dtos';

export interface GameState {
    gameId: string;
    myPlayerId: string;
    currentPlayer: PlayerDTO | null;
    myHand: CardDTO[];
    playedCards: Array<{ playerId: string; card?: CardDTO; isDark: boolean }>;
    roundValue: number;
    trucoRequest: {
        from: string;
        to: string;
        points: number;
    } | null;
    isMyTurn: boolean;
    roundEnded: boolean;
    roundEndedData: RoundEndedDTO | null;
}

export const useGame = (gameId: string, playerId: string) => {
    const [gameState, setGameState] = useState<GameState>({
        gameId,
        myPlayerId: playerId,
        currentPlayer: null,
        myHand: [],
        playedCards: [],
        roundValue: 1,
        trucoRequest: null,
        isMyTurn: false,
        roundEnded: false,
        roundEndedData: null,
    });

    const socket = getSocketConnection();
    const socketObject: Socket = socket.getSocketObject();

    const playCard = useCallback(
        (card: CardDTO, isDark: boolean = false) => {
            if (!gameState.isMyTurn) return;

            socket.playCard({
                gameId,
                playerId,
                card,
                isDark,
            });
        },
        [gameId, playerId, gameState.isMyTurn],
    );

    const askTruco = useCallback(() => {
        if (!gameState.isMyTurn) return;

        socket.askTruco({
            gameId,
            playerId,
        });
    }, [gameId, playerId, gameState.isMyTurn]);

    const acceptTruco = useCallback(() => {
        if (!gameState.trucoRequest || gameState.trucoRequest.to !== playerId)
            return;

        socket.acceptTruco({
            gameId,
            playerId,
        });

        setGameState((prev) => ({
            ...prev,
            trucoRequest: null,
        }));
    }, [gameId, playerId, gameState.trucoRequest]);

    const rejectTruco = useCallback(() => {
        if (!gameState.trucoRequest || gameState.trucoRequest.to !== playerId)
            return;

        socket.rejectTruco({
            gameId,
            playerId,
        });

        setGameState((prev) => ({
            ...prev,
            trucoRequest: null,
        }));
    }, [gameId, playerId, gameState.trucoRequest]);

    useEffect(() => {
        socketObject.on(
            'game:initialized',
            (data: {
                gameId: string;
                myHand: CardDTO[];
                currentPlayer: PlayerDTO;
            }) => {
                setGameState((prev) => ({
                    ...prev,
                    myHand: data.myHand,
                    currentPlayer: data.currentPlayer,
                    isMyTurn: data.currentPlayer.id === playerId,
                }));
            },
        );

        socketObject.on('game:cardplayed', (data: CardPlayedDTO) => {
            setGameState((prev) => {
                const newPlayedCards = [
                    ...prev.playedCards,
                    {
                        playerId: data.playerId,
                        card: data.isDark ? undefined : data.card,
                        isDark: data.isDark,
                    },
                ];

                let newHand = prev.myHand;
                if (data.playerId === playerId && data.card) {
                    newHand = prev.myHand.filter(
                        (c) =>
                            !(
                                c.card === data.card?.card &&
                                c.suit === data.card?.suit
                            ),
                    );
                }

                return {
                    ...prev,
                    playedCards: newPlayedCards,
                    currentPlayer: data.currentPlayer,
                    isMyTurn: data.currentPlayer.id === playerId,
                    myHand: newHand,
                };
            });
        });

        socketObject.on('game:roundended', (data: RoundEndedDTO) => {
            setGameState((prev) => ({
                ...prev,
                roundEnded: true,
                roundEndedData: data,
            }));
        });

        socketObject.on('game:roundstarted', (data: RoundStartedDTO) => {
            setGameState((prev) => ({
                ...prev,
                playedCards: [],
                currentPlayer: data.currentPlayer,
                isMyTurn: data.currentPlayer.id === playerId,
                roundEnded: false,
                roundEndedData: null,
                roundValue: 1,
            }));
        });

        socketObject.on('game:truco:asked', (data: TrucoAskedDTO) => {
            setGameState((prev) => ({
                ...prev,
                trucoRequest: {
                    from: data.playerFrom,
                    to: data.playerTo,
                    points: data.pointsInCaseOfAccept,
                },
            }));
        });

        socketObject.on('game:truco:accepted', () => {
            setGameState((prev) => ({
                ...prev,
                roundValue: prev.trucoRequest?.points || prev.roundValue,
                trucoRequest: null,
            }));
        });

        socketObject.on('game:truco:rejected', () => {
            setGameState((prev) => ({
                ...prev,
                trucoRequest: null,
            }));
        });

        return () => {
            socketObject.off('game:initialized');
            socketObject.off('game:cardplayed');
            socketObject.off('game:roundended');
            socketObject.off('game:roundstarted');
            socketObject.off('game:truco:asked');
            socketObject.off('game:truco:accepted');
            socketObject.off('game:truco:rejected');
        };
    }, [playerId]);

    return {
        gameState,
        setGameState,
        playCard,
        askTruco,
        acceptTruco,
        rejectTruco,
    };
};
