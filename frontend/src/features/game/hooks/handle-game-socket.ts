import { Dispatch, SetStateAction } from 'react';
import { GameState } from '../types/gamestate.type';
import getSocketConnection from '../../../lib/socket-connection';
import { Socket } from 'socket.io-client';
import {
    CardPlayedDTO,
    RoundEndedDTO,
    RoundStartedDTO,
    TrucoAskedDTO,
} from '../game.dto.ts';
import { CardDTO } from '../../../types/dtos.ts';

export const useHandleGameSocket = (
    gameState: GameState,
    setGameState: Dispatch<SetStateAction<GameState>>,
    gameId: string,
    playerId: string,
) => {
    const socket = getSocketConnection();
    const socketObject: Socket = socket.getSocketObject();

    const enableGameSocketListener = () => {
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
                myHand: data.myHand,
            }));
        });

        socketObject.on('game:truco:asked', (data: TrucoAskedDTO) => {
            setGameState((prev) => ({
                ...prev,
                trucoRequest: {
                    from: data.playerFrom,
                    fromName: data.playerFromName,
                    to: data.playerTo,
                    toName: data.playerToName,
                    points: data.pointsInCaseOfAccept,
                },
            }));
        });

        socketObject.on(
            'game:truco:accepted',
            (data: { roundValue: number }) => {
                setGameState((prev) => ({
                    ...prev,
                    roundValue: data.roundValue,
                    trucoRequest: null,
                }));
            },
        );

        socketObject.on('game:truco:rejected', () => {
            setGameState((prev) => ({
                ...prev,
                trucoRequest: null,
            }));
        });
    };

    const disableGameSocketListener = () => {
        socketObject.off('game:cardplayed');
        socketObject.off('game:roundended');
        socketObject.off('game:roundstarted');
        socketObject.off('game:truco:asked');
        socketObject.off('game:truco:accepted');
        socketObject.off('game:truco:rejected');
    };

    const playCard = (card: CardDTO, isDark: boolean = false) => {
        if (!gameState.isMyTurn) return;
        socket.playCard({
            gameId,
            card,
            isDark,
        });
    };

    const askTruco = () => {
        if (!gameState.isMyTurn) return;
        socket.askTruco({
            gameId,
        });
    };

    const acceptTruco = () => {
        socket.acceptTruco({ gameId });
    };

    const rejectTruco = () => {
        socket.rejectTruco({ gameId });
    };

    return {
        enableGameSocketListener,
        disableGameSocketListener,
        playCard,
        askTruco,
        acceptTruco,
        rejectTruco,
    };
};
