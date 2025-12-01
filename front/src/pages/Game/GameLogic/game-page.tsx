import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameBackgroundContext } from '../../../contexts/game-context';
import GameBoard from '../../../components/game-board';
import PlayerHand from '../../../components/player-hand';
import TrucoModal from '../../../components/truco-modal';
import TrucoWaiting from '../../../components/truco-waiting';
import RoundResult from '../../../components/round-result';
import ClickButton from '../../../components/click-button';
import {
    CardDTO,
    PlayerDTO,
    CardPlayedDTO,
    RoundEndedDTO,
    RoundStartedDTO,
    TrucoAskedDTO,
} from '../../../types/dtos';
import getSocketConnection from '../../../lib/socket-connection';
import { Socket } from 'socket.io-client';

interface GamePageProps {
    gameId: string;
    myPlayerId: string;
    initialHand: CardDTO[];
    initialCurrentPlayer: PlayerDTO;
}

interface GameState {
    currentPlayer: PlayerDTO | null;
    myHand: CardDTO[];
    playedCards: Array<{ playerId: string; card?: CardDTO; isDark: boolean }>;
    roundValue: number;
    trucoRequest: {
        from: string;
        fromName: string;
        to: string;
        toName: string;
        points: number;
    } | null;
    isMyTurn: boolean;
    roundEnded: boolean;
    roundEndedData: RoundEndedDTO | null;
}

const GamePage: React.FC<GamePageProps> = ({
    gameId,
    myPlayerId,
    initialHand,
    initialCurrentPlayer,
}) => {
    const { username } = useGameBackgroundContext();
    const socket = getSocketConnection();
    const socketObject: Socket = socket.getSocketObject();

    const [showTrucoAccepted, setShowTrucoAccepted] = useState(false);
    const [acceptedPoints, setAcceptedPoints] = useState(0);

    const [gameState, setGameState] = useState<GameState>({
        currentPlayer: initialCurrentPlayer,
        myHand: initialHand,
        playedCards: [],
        roundValue: 1,
        trucoRequest: null,
        isMyTurn: initialCurrentPlayer.id === myPlayerId,
        roundEnded: false,
        roundEndedData: null,
    });

    useEffect(() => {
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
                if (data.playerId === myPlayerId && data.card) {
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
                    isMyTurn: data.currentPlayer.id === myPlayerId,
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
                isMyTurn: data.currentPlayer.id === myPlayerId,
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
            socketObject.off('game:cardplayed');
            socketObject.off('game:roundended');
            socketObject.off('game:roundstarted');
            socketObject.off('game:truco:asked');
            socketObject.off('game:truco:accepted');
            socketObject.off('game:truco:rejected');
        };
    }, [myPlayerId]);

    const socketId = socketObject.id || '';

    const playCard = (card: CardDTO, isDark: boolean = false) => {
        if (!gameState.isMyTurn) return;
        socket.playCard({
            gameId,
            socketId,
            card,
            isDark,
        });
    };

    const askTruco = () => {
        if (!gameState.isMyTurn) return;
        socket.askTruco({
            gameId,
            socketId,
        });
    };

    const handleCardClick = (card: CardDTO, isDark: boolean = false) => {
        playCard(card, isDark);
    };

    const handleTrucoAsk = () => {
        askTruco();
    };

    const handleTrucoAccept = () => {
        const points = gameState.trucoRequest?.points || 0;
        if (!gameState.trucoRequest || gameState.trucoRequest.to !== myPlayerId)
            return;
        socket.acceptTruco({ gameId, socketId });
        setGameState((prev) => ({ ...prev, trucoRequest: null }));
        setAcceptedPoints(points);
        setShowTrucoAccepted(true);
        setTimeout(() => setShowTrucoAccepted(false), 2000);
    };

    const handleTrucoReject = () => {
        if (!gameState.trucoRequest || gameState.trucoRequest.to !== myPlayerId)
            return;
        socket.rejectTruco({ gameId, socketId });
        setGameState((prev) => ({ ...prev, trucoRequest: null }));
    };

    const getNextTrucoValue = () => {
        const sequence = [1, 3, 6, 9, 12];
        const currentIndex = sequence.indexOf(gameState.roundValue);
        if (currentIndex === -1 || currentIndex === sequence.length - 1) {
            return null;
        }
        return sequence[currentIndex + 1];
    };

    const canAskTruco = gameState.isMyTurn && getNextTrucoValue() !== null;

    return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-emerald-900 to-emerald-950">
            {/* Background decoration */}
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

            {/* Main content */}
            <div className="relative flex flex-col h-full p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-black text-amber-400 tracking-tight">
                            TRUCO
                        </h1>
                        <p className="text-amber-200 text-sm">
                            Jogador: {username}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-right"
                    >
                        {gameState.isMyTurn ? (
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                }}
                            >
                                <p className="text-3xl font-black text-amber-400">
                                    SUA VEZ!
                                </p>
                            </motion.div>
                        ) : (
                            <p className="text-xl text-amber-200">
                                Aguardando jogada...
                            </p>
                        )}
                    </motion.div>
                </div>

                {/* Game board */}
                <div className="flex-1 flex flex-col justify-center items-center gap-8">
                    <GameBoard
                        playedCards={gameState.playedCards}
                        roundValue={gameState.roundValue}
                    />

                    {/* Truco button */}
                    {canAskTruco && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <ClickButton
                                name={`TRUCO! (${getNextTrucoValue()} pontos)`}
                                defaultStyles="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-2xl px-10 py-4 rounded-xl shadow-lg transition-all transform hover:scale-105 border-4 border-red-800"
                                onClick={handleTrucoAsk}
                            />
                        </motion.div>
                    )}
                </div>

                {/* Player's hand */}
                <div className="mt-auto">
                    <PlayerHand
                        cards={gameState.myHand}
                        onCardClick={handleCardClick}
                        isMyTurn={gameState.isMyTurn}
                    />
                </div>

                {/* Dark card option button */}
                {gameState.isMyTurn && gameState.myHand.length > 0 && (
                    <motion.div
                        className="absolute bottom-8 left-8"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <ClickButton
                            name="JOGAR ESCURO"
                            defaultStyles="bg-emerald-700 hover:bg-emerald-600 text-amber-300 font-bold text-lg px-6 py-3 rounded-lg shadow-lg transition-all border-2 border-emerald-500"
                            onClick={() =>
                                handleCardClick(gameState.myHand[0], true)
                            }
                        />
                    </motion.div>
                )}
            </div>

            {/* Truco request modal */}
            <TrucoModal
                isOpen={
                    gameState.trucoRequest !== null &&
                    gameState.trucoRequest.to === myPlayerId
                }
                isRequest={true}
                playerFromName={gameState.trucoRequest?.fromName || 'Jogador'}
                points={gameState.trucoRequest?.points}
                onAccept={handleTrucoAccept}
                onReject={handleTrucoReject}
            />

            {/* Truco waiting modal - quando EU pedi truco */}
            <TrucoWaiting
                isOpen={
                    gameState.trucoRequest !== null &&
                    gameState.trucoRequest.from === myPlayerId
                }
                playerToName={gameState.trucoRequest?.toName || 'Jogador'}
                points={gameState.trucoRequest?.points || 0}
            />

            {/* Truco accepted modal */}
            <TrucoModal
                isOpen={showTrucoAccepted}
                isRequest={false}
                points={acceptedPoints}
                onClose={() => setShowTrucoAccepted(false)}
            />

            {/* Round result modal */}
            <RoundResult
                isVisible={gameState.roundEnded}
                roundData={gameState.roundEndedData}
            />
        </div>
    );
};

export default GamePage;
