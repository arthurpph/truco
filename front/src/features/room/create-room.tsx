import { useEffect, useRef, useState } from 'react';
import { useGameBackgroundContext } from '../../contexts/game-context';
import ClickButton from '../../components/click-button';
import getSocketConnection from '../../lib/socket-connection';
import ClickDiv from '../../components/click-div';
import LeftSign from '../../components/left-sign';
import AnimatedPage from '../../components/animated-page';
import RoomsList from './rooms-list/rooms-list';
import { AnimatePresence } from 'framer-motion';
import RoomPage from './room-page/room-page';

const CreateRoom = () => {
    const roomNameRef = useRef<HTMLInputElement | null>(null);
    const [showRoomsList, setShowRoomsList] = useState<boolean>(false);
    const [roomPageInfo, setRoomPageInfo] = useState<{
        show: boolean;
        roomId?: string;
    }>({ show: false });

    const { backgroundColor, setBackgroundColor, username } =
        useGameBackgroundContext();
    const previousBackgroundColor = useRef<string>(backgroundColor);
    const socket = getSocketConnection();

    useEffect(() => {
        previousBackgroundColor.current = backgroundColor;
        setBackgroundColor('bg-white-transparent');

        return () => setBackgroundColor(previousBackgroundColor.current);
    }, []);

    const createRoom = () => {
        const roomName: string = roomNameRef.current!.value;

        if (roomName == '') {
            return;
        }

        socket.createRoom(
            {
                roomName: roomName,
                playerName: username,
            },
            (room) => {
                setRoomPageInfo({ show: true, roomId: room.id });
            },
        );
    };

    return (
        <>
            <AnimatePresence>
                {showRoomsList ? (
                    <AnimatedPage startDirection="left">
                        <RoomsList />
                    </AnimatedPage>
                ) : roomPageInfo.show ? (
                    <AnimatedPage startDirection="left">
                        <RoomPage roomId={roomPageInfo.roomId} />
                    </AnimatedPage>
                ) : (
                    <AnimatedPage startDirection="right">
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
                                <div className="flex items-center px-8 py-6 mb-8">
                                    <ClickDiv
                                        onClick={() => setShowRoomsList(true)}
                                        defaultStyles="cursor-pointer hover:scale-110 transition-transform mr-4"
                                    >
                                        <LeftSign />
                                    </ClickDiv>
                                    <h1 className="text-5xl font-black text-amber-400 tracking-tight">
                                        CRIAR SALA
                                    </h1>
                                </div>

                                <div className="flex items-center justify-center flex-1">
                                    <div className="bg-emerald-900/40 backdrop-blur-sm p-8 rounded-2xl border border-emerald-700/50 w-full max-w-md">
                                        <div className="mb-6">
                                            <label className="block text-amber-100 text-sm mb-2 font-medium">
                                                Nome da sala
                                            </label>
                                            <input
                                                type="text"
                                                ref={roomNameRef}
                                                placeholder="Digite o nome da sala"
                                                className="w-full h-14 px-4 bg-emerald-950/60 text-white text-lg rounded-lg
                          border-2 border-emerald-600/50 focus:border-amber-500 focus:outline-none 
                          transition-colors placeholder:text-emerald-600"
                                            />
                                        </div>
                                        <ClickButton
                                            name="Criar"
                                            defaultStyles="w-full h-14 bg-amber-500 hover:bg-amber-400 text-emerald-950 
                        font-bold text-lg rounded-lg transition-colors uppercase tracking-wide cursor-pointer"
                                            onClick={createRoom}
                                        />
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

export default CreateRoom;
