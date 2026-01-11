import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameBackgroundContext } from '../../contexts/ui-context';
import GameBoard from './components/game-board.tsx';
import ClickButton from '../../components/click-button';
import PlayerHand from './components/player-hand.tsx';
import TrucoModal from './components/truco-modal.tsx';
import RoundResult from './components/round-result.tsx';
import TrucoWaiting from './components/truco-waiting.tsx';
import { GameState } from './types/gamestate.type';
import { CardDTO, PlayerDTO } from '../../types/dtos.ts';
import { useHandleGameSocket } from './hooks/handle-game-socket.ts';

type GamePageProps = {
    gameId: string;
    myPlayerId: string;
    initialHand: CardDTO[];
    initialCurrentPlayer: PlayerDTO;
};

const GamePage: React.FC<GamePageProps> = ({
    gameId,
    myPlayerId,
    initialHand,
    initialCurrentPlayer,
}) => {
    const { username } = useGameBackgroundContext();

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
    const {
        enableGameSocketListener,
        disableGameSocketListener,
        playCard,
        askTruco,
        acceptTruco,
        rejectTruco,
    } = useHandleGameSocket(gameState, setGameState, gameId, myPlayerId);

    useEffect(() => {
        enableGameSocketListener();

        return () => {
            disableGameSocketListener();
        };
    }, [myPlayerId]);

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
        acceptTruco();
        setGameState((prev) => ({ ...prev, trucoRequest: null }));
        setAcceptedPoints(points);
        setShowTrucoAccepted(true);
        setTimeout(() => setShowTrucoAccepted(false), 2000);
    };

    const handleTrucoReject = () => {
        if (!gameState.trucoRequest || gameState.trucoRequest.to !== myPlayerId)
            return;
        rejectTruco();
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

            <div className="relative flex flex-col h-full p-8">
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

                <div className="flex-1 flex flex-col justify-center items-center gap-8">
                    <GameBoard
                        playedCards={gameState.playedCards}
                        roundValue={gameState.roundValue}
                    />

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

                <div className="mt-auto">
                    <PlayerHand
                        cards={gameState.myHand}
                        onCardClick={handleCardClick}
                        isMyTurn={gameState.isMyTurn}
                    />
                </div>

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

            <TrucoWaiting
                isOpen={
                    gameState.trucoRequest !== null &&
                    gameState.trucoRequest.from === myPlayerId
                }
                playerToName={gameState.trucoRequest?.toName || 'Jogador'}
                points={gameState.trucoRequest?.points || 0}
            />

            <TrucoModal
                isOpen={showTrucoAccepted}
                isRequest={false}
                points={acceptedPoints}
                onClose={() => setShowTrucoAccepted(false)}
            />

            <RoundResult
                isVisible={gameState.roundEnded}
                roundData={gameState.roundEndedData}
            />
        </div>
    );
};

export default GamePage;
