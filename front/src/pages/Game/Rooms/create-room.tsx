import { useEffect, useRef, useState } from "react";
import { useGameBackgroundContext } from "../../../contexts/game-context";
import ClickButton from "../../../components/click-button";
import getSocketConnection from "../../../lib/socket-connection";
import ClickDiv from "../../../components/click-div";
import LeftSign from "../../../components/left-sign";
import AnimatedPage from "../../../components/animated-page";
import RoomsList from "./RoomsList/rooms-list";
import { AnimatePresence } from "framer-motion";
import RoomPage from "./RoomPage/room-page";

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
    setBackgroundColor("bg-white-transparent");

    return () => setBackgroundColor(previousBackgroundColor.current);
  }, []);

  const createRoom = () => {
    const roomName: string = roomNameRef.current!.value;

    if (roomName == "") {
      return;
    }

    socket.createRoom(
      {
        roomName: roomName,
        playerName: username,
      },
      (room) => {
        setRoomPageInfo({ show: true, roomId: room.id });
      }
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
            <div className="flex flex-col h-full bg-white rounded-game-border-2 select-none">
              <div className="relative flex items-center justify-center bg-blue h-[148px] rounded-t-game-border-2">
                <ClickDiv
                  onClick={() => setShowRoomsList(true)}
                  defaultStyles="absolute top-0 left-0 cursor-pointer scale:100 active:scale-110"
                >
                  <LeftSign />
                </ClickDiv>
                <h1 className="font-open-sans-semibold font-bold text-white text-[35px] select-none">
                  Criar Sala
                </h1>
              </div>
              <div className="flex flex-col items-center justify-center h-full gap-6">
                <input
                  type="text"
                  className="font-pt-sans font-normal bg-white-3 text-[25px] text-gray-500 w-[350px] h-[50px] 
                                    rounded-[10px] leading-[75px] pl-[10px] border-2 border-white 
                                    transition-transform duration-150 ease-linear transform focus:scale-105 focus:outline-none
                                "
                  ref={roomNameRef}
                />
                <ClickButton
                  name="Criar"
                  defaultStyles="animate-btsHome cursor-pointer text-[30px] font-bold bg-yellow text-purple-2 w-[350px] h-[72px] rounded-[10px] tracking-[1px] select-none uppercase active:bg-yellow-2"
                  onClick={createRoom}
                />
              </div>
            </div>
          </AnimatedPage>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateRoom;
