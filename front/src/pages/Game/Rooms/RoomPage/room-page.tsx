import React, { useEffect, useState } from 'react';
import { useGameBackgroundContext } from '../../../../contexts/game-context';
import getSocketConnection from '../../../../lib/socket-connection';
import { Room } from '../../../../types/models';
import TeamSection from './team-section';
import { AnimatePresence } from 'framer-motion';
import ClickDiv from '../../../../components/click-div';
import LeftSign from '../../../../components/left-sign';
import AnimatedPage from '../../../../components/animated-page';
import RoomsList from '../RoomsList/rooms-list';
import { Socket } from 'socket.io-client';
import { RoomDTO } from '../../../../types/dtos';
import ClickButton from '../../../../components/click-button';

interface RoomPageProps {
    roomId: string | undefined;
}

const RoomPage: React.FC<RoomPageProps> = ({ roomId }) => {
    const [showRoomsList, setShowRoomsList] = useState<boolean>(false);

    const [roomData, setRoomData] = useState<Room | null>(null);

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

        socketObject.once('gameStarted', () => {
            console.log('game started');
        });

        return () => {
            socketObject.off('room:update');
            setDefaultBackgroundColor();
        };
    }, []);

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
                                    <div className="flex items-center px-8 py-6 mb-4">
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
                                        <h1 className="text-5xl font-black text-amber-400 tracking-tight">
                                            {roomData.name}
                                        </h1>
                                    </div>

                                    <div className="flex-1 flex flex-col gap-6 px-8">
                                        <TeamSection
                                            team={roomData.teams[0]}
                                            playersReady={roomData.playersReady}
                                            backgroundColor="bg-emerald-900/40"
                                        />
                                        <TeamSection
                                            team={roomData.teams[1]}
                                            playersReady={roomData.playersReady}
                                            backgroundColor="bg-emerald-900/30"
                                        />
                                        <div className="flex items-center justify-center py-8">
                                            <ClickButton
                                                name="Estou pronto"
                                                defaultStyles="bg-amber-500 hover:bg-amber-400 w-80 h-16 text-xl text-emerald-950 font-bold uppercase rounded-lg transition-colors cursor-pointer"
                                                onClick={handleToggleIsReady}
                                            />
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
