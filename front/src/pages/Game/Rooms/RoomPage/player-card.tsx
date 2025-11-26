import { Player } from "../../../../types/models";

const PlayerCard = ({
  player,
  index,
}: {
  player: Player | null;
  index: number;
}) => (
  <div
    className={`flex flex-col items-center justify-center gap-4 ${
      index % 2 == 0 ? "ml-auto" : "mr-auto"
    }`}
  >
    <div
      className={`w-32 h-32 rounded-full border-4 ${
        player ? "border-amber-500" : "border-emerald-700"
      }`}
      style={{
        backgroundImage: player
          ? "url('/src/assets/playerimage.png')"
          : "url('/src/assets/avatarvazio.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    ></div>
  </div>
);

export default PlayerCard;
