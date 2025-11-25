import { Team } from "../../../../types/models";
import PlayerCard from "./player-card";

const TeamSection = ({
  team,
  backgroundColor,
}: {
  team: Team;
  backgroundColor: string;
}) => {
  return (
    <div
      className={`flex items-center justify-center w-full h-[28%] gap-[140px] ${backgroundColor}`}
    >
      {team.map((player, index) => (
        <div
          key={index}
          className="flex w-[320px] justify-between items-center"
        >
          {player && (
            <div
              className={`flex flex-col ${
                index % 2 === 0 ? "items-end" : "items-start order-last"
              }`}
            >
              <h3 className="text-[25px] text-purple font-bold">
                {player.name}
              </h3>
              <div
                className={`flex items-center justify-center ${
                  player.isReady ? "bg-green" : "bg-light-gray"
                } w-[120px] h-[28px] text-[15px] font-bold text-center text-white uppercase border-2 ${
                  player.isReady ? "border-green" : "border-light-gray"
                } rounded-[5px]`}
              >
                {player.isReady ? "Estou pronto" : "Aguardando"}
              </div>
            </div>
          )}
          <PlayerCard player={player} index={index} />
        </div>
      ))}
    </div>
  );
};

export default TeamSection;
