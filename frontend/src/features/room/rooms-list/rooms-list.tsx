import { useEffect, useState } from 'react';
import CreateRoom from '../create-room';
import { AnimatePresence } from 'framer-motion';
import RoomPage from '../room-page/room-page';
import RoomView from './room-view';
import { Room, ShowRoomInfo } from '../../../types/models';
import getSocketConnection from '../../../lib/socket-connection';
import Home from '../../home/Home';
import ClickDiv from '../components/click-div';
import LeftSign from '../components/left-sign';
import ClickButton from '../../../components/click-button';
import AnimatedPage from '../components/animated-page';

const RoomsList = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [requestRoomListIntervalId, setRequestRoomListIntervalId] = useState<
        number | null
    >(null);

    const [showRoom, setShowRoom] = useState<ShowRoomInfo>({ show: false });
    const [showCreateRoom, setShowCreateRoom] = useState<boolean>(false);
    const [showHome, setShowHome] = useState<boolean>(false);

    const requestRoomList = () => {
        const socket = getSocketConnection();
        socket.requestRoomList((data: Room[]) => {
            setRooms(data);
        });
    };

    useEffect(() => {
        requestRoomList();

        if (
            (showRoom || showCreateRoom || showHome) &&
            requestRoomListIntervalId
        ) {
            clearInterval(requestRoomListIntervalId);
            return;
        }

        const interval = setInterval(requestRoomList, 5000);
        setRequestRoomListIntervalId(interval);

        return () => clearInterval(interval);
    }, [showRoom, showCreateRoom, showHome]);

    return (
        <>
            <AnimatePresence mode="wait">
                {showHome ? (
                    <AnimatedPage key="home" startDirection="left">
                        <Home />
                    </AnimatedPage>
                ) : showRoom.show ? (
                    <AnimatedPage key="room-page" startDirection="right">
                        <RoomPage roomId={showRoom.roomId} />
                    </AnimatedPage>
                ) : showCreateRoom ? (
                    <AnimatedPage key="create-room" startDirection="right">
                        <CreateRoom />
                    </AnimatedPage>
                ) : (
                    <AnimatedPage key="rooms-list" startDirection="left">
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

                            <div className="relative flex flex-col h-full px-8 py-6">
                                <div className="flex items-center mb-6">
                                    <ClickDiv
                                        onClick={() => setShowHome(true)}
                                        defaultStyles="cursor-pointer hover:scale-110 transition-transform mr-4"
                                    >
                                        <LeftSign />
                                    </ClickDiv>
                                    <h1 className="text-5xl font-black text-amber-400 tracking-tight">
                                        SALAS DISPONÍVEIS
                                    </h1>
                                </div>

                                <div className="flex gap-6 h-full">
                                    <div className="bg-emerald-900/40 backdrop-blur-sm p-6 rounded-2xl border border-emerald-700/50 flex flex-col items-center justify-center gap-6 w-[280px]">
                                        <p className="text-2xl text-amber-200 font-bold text-center">
                                            Salas Criadas
                                        </p>
                                        <ClickButton
                                            name="Criar Sala"
                                            defaultStyles="bg-amber-500 hover:bg-amber-400 w-full h-14 rounded-lg font-bold text-lg text-emerald-950 cursor-pointer uppercase transition-colors"
                                            onClick={() =>
                                                setShowCreateRoom(true)
                                            }
                                        />
                                    </div>

                                    <div className="flex-1 overflow-auto custom-scroll">
                                        <div className="grid grid-cols-3 gap-6">
                                            {rooms.length > 0 ? (
                                                rooms.map((room) => (
                                                    <RoomView
                                                        key={room.id}
                                                        room={room}
                                                        setShowRoom={
                                                            setShowRoom
                                                        }
                                                    />
                                                ))
                                            ) : (
                                                <div className="col-span-3 flex items-center justify-center h-96">
                                                    <p className="text-2xl text-emerald-400/60 text-center">
                                                        Nenhuma sala criada
                                                        ainda.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedPage>
                )}
            </AnimatePresence>
        </>
    );
};

export default RoomsList;
