import { useEffect, useState } from "react";
import ClickButton from "../../../../components/click-button";
import getSocketConnection from "../../../../lib/socket-connection";
import { Room, ShowRoomInfo } from "../../../../types/models";
import CreateRoom from "../create-room";
import AnimatedPage from "../../../../components/animated-page";
import LeftSign from "../../../../components/left-sign";
import ClickDiv from "../../../../components/click-div";
import Home from "../../home";
import { AnimatePresence } from "framer-motion";
import RoomPage from "../RoomPage/room-page";
import RoomView from "./room-view";

const RoomsList = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [requestRoomListIntervalId, setRequestRoomListIntervalId] =
    useState<NodeJS.Timeout | null>(null);

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

    if ((showRoom || showCreateRoom || showHome) && requestRoomListIntervalId) {
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
            <div className="flex flex-col h-full rounded-game-border select-none">
              <div className="relative flex items-center justify-center bg-orange-3 h-[148px] rounded-t-game-border-2">
                <ClickDiv
                  onClick={() => setShowHome(true)}
                  defaultStyles="absolute top-0 left-0 cursor-pointer scale:100 active:scale-110"
                >
                  <LeftSign />
                </ClickDiv>
                <h1 className="font-open-sans-semibold font-bold text-white text-[35px] select-none">
                  Salas
                </h1>
              </div>
              <div className="bg-white-2 flex justify-between h-full rounded-b-game-border-2 gap-10">
                <div className="bg-white flex flex-col items-center justify-center gap-8 w-[280px] h-[93%] mt-5 ml-5 rounded-game-border border-[3px] border-[#ff5700]">
                  <p className="text-[30px] text-purple font-semibold select-none">
                    Salas Criadas
                  </p>
                  <ClickButton
                    name="Criar Sala"
                    defaultStyles="bg-green w-[210px] h-[71px] rounded-game-border select-none font-extrabold text-[25px] text-white cursor-pointer uppercase active:scale-105 active:bg-green-2"
                    onClick={() => setShowCreateRoom(true)}
                  />
                </div>
                <div className="w-[76%] h-full max-h-[600px] flex flex-wrap content-start overflow-auto mt-[20px] custom-scroll">
                  {rooms.length > 0 ? (
                    rooms.map((room) => (
                      <RoomView
                        key={room.id}
                        room={room}
                        setShowRoom={setShowRoom}
                      />
                    ))
                  ) : (
                    <div className="w-[80%] h-[85%] flex items-center justify-center">
                      <p className="text-[25px] text-center text-gray-500">
                        Nenhuma sala criada ainda.
                      </p>
                    </div>
                  )}
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
