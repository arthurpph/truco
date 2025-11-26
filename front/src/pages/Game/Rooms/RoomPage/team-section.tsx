import { Team } from "../../../../types/models";
import PlayerCard from "./player-card";

const TeamSection = ({
  team,
  playersReady,
  backgroundColor,
}: {
  team: Team;
  playersReady: string[];
  backgroundColor: string;
}) => {
  return (
    <div
      className={`flex items-center justify-center w-full gap-12 p-6 backdrop-blur-sm rounded-2xl border border-emerald-700/50 ${backgroundColor}`}
    >
      {team.map((player, index) => {
        const isPlayerReady =
          player !== null && playersReady.includes(player.id);

        return (
          <div key={index} className="flex w-80 justify-between items-center">
            {player && (
              <div
                className={`flex flex-col ${
                  index % 2 === 0 ? "items-end" : "items-start order-last"
                }`}
              >
                <h3 className="text-xl text-amber-200 font-bold mb-2">
                  {player.name}
                </h3>
                <div
                  className={`flex items-center justify-center ${
                    isPlayerReady ? "bg-emerald-600" : "bg-emerald-800/50"
                  } px-4 py-1.5 text-sm font-bold text-center text-white uppercase border-2 ${
                    isPlayerReady ? "border-emerald-500" : "border-emerald-700"
                  } rounded-lg`}
                >
                  {isPlayerReady ? "Pronto" : "Aguardando"}
                </div>
              </div>
            )}
            <PlayerCard player={player} index={index} />
          </div>
        );
      })}
    </div>
  );
};

export default TeamSection;
