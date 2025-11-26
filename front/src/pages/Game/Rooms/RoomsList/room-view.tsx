import { useGameBackgroundContext } from "../../../../contexts/game-context";
import getSocketConnection from "../../../../lib/socket-connection";
import { Room, ShowRoomInfo } from "../../../../types/models";

interface RoomProps {
  room: Room;
  setShowRoom: React.Dispatch<React.SetStateAction<ShowRoomInfo>>;
}

const RoomView = ({ room, setShowRoom }: RoomProps) => {
  const { username } = useGameBackgroundContext();
  const socket = getSocketConnection();

  const handleRoomClick = (roomId: string) => {
    socket.joinRoom(
      {
        roomId,
        playerName: username,
      },
      (room) => {
        setShowRoom({ show: true, roomId: room.id });
      }
    );
  };

  return (
    <div
      onClick={() => handleRoomClick(room.id)}
      key={room.id}
      className="flex flex-col bg-emerald-900/40 backdrop-blur-sm border border-emerald-700/50 rounded-2xl p-6 cursor-pointer hover:border-amber-500/50 transition-all hover:scale-105"
    >
      <h2 className="text-2xl text-amber-400 font-bold text-center mb-4">
        {room.name}
      </h2>
      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-[url('/src/assets/avatarvazio.png')] bg-cover bg-no-repeat bg-center w-16 h-16 border-2 border-emerald-600 rounded-full"></div>
          <div className="bg-[url('/src/assets/avatarvazio.png')] bg-cover bg-no-repeat bg-center w-16 h-16 border-2 border-emerald-600 rounded-full"></div>
        </div>
        <span className="text-amber-200 text-xl font-bold">VS</span>
        <div className="flex flex-col items-center gap-3">
          <div className="bg-[url('/src/assets/avatarvazio.png')] bg-cover bg-no-repeat bg-center w-16 h-16 border-2 border-emerald-600 rounded-full"></div>
          <div className="bg-[url('/src/assets/avatarvazio.png')] bg-cover bg-no-repeat bg-center w-16 h-16 border-2 border-emerald-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default RoomView;
