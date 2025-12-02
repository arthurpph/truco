import React, { useEffect, useState } from 'react';
import TeamSection from './team-section';
import { AnimatePresence } from 'framer-motion';
import { Socket } from 'socket.io-client';
import { CardDTO, PlayerDTO, RoomDTO } from '../../../types/dtos';
import { Room } from '../../../types/models';
import { useGameBackgroundContext } from '../../../contexts/game-context';
import getSocketConnection from '../../../lib/socket-connection';
import GamePage from '../../game/game-page';
import AnimatedPage from '../../../components/animated-page';
import RoomsList from '../rooms-list/rooms-list';
import ClickDiv from '../../../components/click-div';
import LeftSign from '../../../components/left-sign';
import ClickButton from '../../../components/click-button';

interface RoomPageProps {
    roomId: string | undefined;
}

interface GameInitializedData {
    gameId: string;
    myPlayerId: string;
    myHand: CardDTO[];
    currentPlayer: PlayerDTO;
}

const RoomPage: React.FC<RoomPageProps> = ({ roomId }) => {
    const [showRoomsList, setShowRoomsList] = useState<boolean>(false);
    const [roomData, setRoomData] = useState<Room | null>(null);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [gameId, setGameId] = useState<string>('');
    const [myPlayerId, setMyPlayerId] = useState<string>('');
    const [initialHand, setInitialHand] = useState<CardDTO[]>([]);
    const [initialCurrentPlayer, setInitialCurrentPlayer] =
        useState<PlayerDTO | null>(null);

    const { username, setBackgroundColor, setDefaultBackgroundColor } =
        useGameBackgroundContext();
    const socket = getSocketConnection();

    const fetchRoomData = (): void => {
        if (!roomId) {
            throw new Error('roomId cannot be undefined');
        }

        socket.requestRoomInfo({ roomId }, (data: Room) => {
            setRoomData(data);
        });
    };

    const handleBackToRoomsList = (roomId: string | null): void => {
        if (!roomId) {
            setShowRoomsList(true);
            return;
        }

        leaveRoom(roomId);
    };

    const handleToggleIsReady = () => {
        socket.toggleIsReady({
            roomId: roomData!.id,
            playerName: username,
        });
    };

    const leaveRoom = (roomId: string) => {
        socket.leaveRoom(
            {
                roomId,
                playerName: username,
            },
            () => {
                setShowRoomsList(true);
            },
        );
    };

    useEffect(() => {
        setBackgroundColor('white');
        fetchRoomData();

        const socketObject: Socket = socket.getSocketObject();

        socketObject.on('room:update', (roomData: RoomDTO) => {
            setRoomData(roomData as Room);
        });

        socketObject.on('game:initialized', (data: GameInitializedData) => {
            setGameId(data.gameId);
            setMyPlayerId(data.myPlayerId);
            setInitialHand(data.myHand);
            setInitialCurrentPlayer(data.currentPlayer);
            setGameStarted(true);
        });

        return () => {
            socketObject.off('room:update');
            socketObject.off('game:initialized');
            setDefaultBackgroundColor();
        };
    }, []);

    if (gameStarted && gameId && initialCurrentPlayer && myPlayerId) {
        return (
            <GamePage
                gameId={gameId}
                myPlayerId={myPlayerId}
                initialHand={initialHand}
                initialCurrentPlayer={initialCurrentPlayer}
            />
        );
    }

    return (
        <>
            <AnimatePresence mode="wait">
                {showRoomsList ? (
                    <AnimatedPage key="home" startDirection="left">
                        <RoomsList />
                    </AnimatedPage>
                ) : (
                    <AnimatedPage key="room-page" startDirection="right">
                        {!roomData ? (
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
                                <div className="relative flex items-center px-8 py-6">
                                    <ClickDiv
                                        onClick={() =>
                                            handleBackToRoomsList(null)
                                        }
                                        defaultStyles="cursor-pointer hover:scale-110 transition-transform mr-4"
                                    >
                                        <LeftSign />
                                    </ClickDiv>
                                </div>
                                <div className="relative flex items-center justify-center h-full">
                                    <p className="text-2xl text-amber-200">
                                        Sala especificada não existe
                                    </p>
                                </div>
                            </div>
                        ) : (
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

                                <div className="relative flex flex-col h-full">
                                    <div className="flex items-center justify-between px-8 py-6 mb-2">
                                        <div className="flex items-center">
                                            <ClickDiv
                                                onClick={() =>
                                                    handleBackToRoomsList(
                                                        roomData.id,
                                                    )
                                                }
                                                defaultStyles="cursor-pointer hover:scale-110 transition-transform mr-4"
                                            >
                                                <LeftSign />
                                            </ClickDiv>
                                            <div>
                                                <h1 className="text-5xl font-black text-amber-400 tracking-tight">
                                                    {roomData.name}
                                                </h1>
                                                <p className="text-emerald-500/80 text-sm mt-1">
                                                    Aguardando jogadores
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-emerald-800/40 px-4 py-2 rounded-xl border border-emerald-700/50">
                                            <span className="text-amber-300 font-bold text-lg">
                                                {roomData.playersReady.length}
                                            </span>
                                            <span className="text-emerald-400/80 text-sm">
                                                / 4 prontos
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col gap-4 px-8">
                                        <TeamSection
                                            team={roomData.teams[0]}
                                            playersReady={roomData.playersReady}
                                            backgroundColor="bg-emerald-900/40"
                                            teamLabel="Time 1"
                                        />
                                        
                                        <div className="flex items-center justify-center">
                                            <div className="flex items-center gap-3">
                                                <div className="h-px w-20 bg-emerald-700/50"></div>
                                                <span className="text-amber-500/60 text-sm font-bold uppercase tracking-wider">vs</span>
                                                <div className="h-px w-20 bg-emerald-700/50"></div>
                                            </div>
                                        </div>

                                        <TeamSection
                                            team={roomData.teams[1]}
                                            playersReady={roomData.playersReady}
                                            backgroundColor="bg-emerald-900/30"
                                            teamLabel="Time 2"
                                        />
                                        
                                        <div className="flex flex-col items-center justify-center py-6 gap-3">
                                            <ClickButton
                                                name="Estou pronto"
                                                defaultStyles="bg-amber-500 hover:bg-amber-400 w-80 h-16 text-xl text-emerald-950 font-bold uppercase rounded-xl transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-amber-500/20"
                                                onClick={handleToggleIsReady}
                                            />
                                            <p className="text-emerald-600/60 text-xs">
                                                A partida inicia quando todos estiverem prontos
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </AnimatedPage>
                )}
            </AnimatePresence>
        </>
    );
};

export default RoomPage;
