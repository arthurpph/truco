import React, { useEffect, useState } from "react";
import { useGameBackgroundContext } from "../../../../contexts/game-context";
import getSocketConnection from "../../../../lib/socket-connection";
import { Room } from "../../../../types/models";
import TeamSection from "./team-section";
import { AnimatePresence } from "framer-motion";
import ClickDiv from "../../../../components/click-div";
import LeftSign from "../../../../components/left-sign";
import AnimatedPage from "../../../../components/animated-page";
import RoomsList from "../RoomsList/rooms-list";
import { Socket } from "socket.io-client";
import { RoomDTO } from "../../../../types/dtos";
import ClickButton from "../../../../components/click-button";

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
      throw new Error("roomId cannot be undefined");
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
      }
    );
  };

  useEffect(() => {
    setBackgroundColor("white");
    fetchRoomData();

    const socketObject: Socket = socket.getSocketObject();

    socketObject.on("room:update", (roomData: RoomDTO) => {
      setRoomData(roomData as Room);
    });

    socketObject.once("gameStarted", () => {
      console.log("game started");
    });

    return () => {
      socketObject.off("room:update");
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
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="relative bg-blue w-full h-[13%] flex items-center justify-center rounded-t-game-border-2">
                  <ClickDiv
                    onClick={() => handleBackToRoomsList(roomData)}
                    defaultStyles="absolute top-0 left-0 cursor-pointer scale:100 active:scale-110"
                  >
                    <LeftSign />
                  </ClickDiv>
                </div>
                <div>Sala especificada não existe</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="relative bg-blue w-full h-[13%] text-[45px] text-white flex items-center justify-center rounded-t-game-border-2">
                  <ClickDiv
                    onClick={() => handleBackToRoomsList(roomData.id)}
                    defaultStyles="absolute top-0 left-0 cursor-pointer scale:100 active:scale-110"
                  >
                    <LeftSign />
                  </ClickDiv>
                  <h2>{roomData.name}</h2>
                </div>
                <TeamSection
                  team={roomData.teams[0]}
                  playersReady={roomData.playersReady}
                  backgroundColor="bg-white-2"
                />
                <TeamSection
                  team={roomData.teams[1]}
                  playersReady={roomData.playersReady}
                  backgroundColor="bg-white"
                />
                <div className="flex flex-col items-center justify-center bg-white-2 w-full h-[34%]">
                  <ClickButton
                    name="Estou pronto"
                    defaultStyles="bg-blue w-[300px] h-[80px] text-[25px] text-white font-bold uppercase rounded-[10px] active:scale-110"
                    onClick={handleToggleIsReady}
                  />
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
