import { Team } from '../../../types/models';
import PlayerCard from './player-card';

const TeamSection = ({
    team,
    playersReady,
    backgroundColor,
    teamLabel,
}: {
    team: Team;
    playersReady: string[];
    backgroundColor: string;
    teamLabel: string;
}) => {
    const readyCount = team.filter(
        (player) => player !== null && playersReady.includes(player.id)
    ).length;

    return (
        <div
            className={`flex flex-col w-full p-5 backdrop-blur-sm rounded-2xl border border-emerald-700/50 ${backgroundColor}`}
        >
            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-sm font-bold text-emerald-500/80 uppercase tracking-wider">
                    {teamLabel}
                </h2>
                <span className="text-xs text-emerald-600/60">
                    {readyCount}/2 prontos
                </span>
            </div>
            
            <div className="flex items-center justify-center gap-12">
                {team.map((player, index) => {
                    const isPlayerReady =
                        player !== null && playersReady.includes(player.id);

                    return (
                        <div
                            key={index}
                            className="flex w-80 justify-between items-center"
                        >
                            {player ? (
                                <div
                                    className={`flex flex-col ${
                                        index % 2 === 0
                                            ? 'items-end'
                                            : 'items-start order-last'
                                    }`}
                                >
                                    <h3 className="text-xl text-amber-200 font-bold mb-2">
                                        {player.name}
                                    </h3>
                                    <div
                                        className={`flex items-center gap-2 ${
                                            isPlayerReady
                                                ? 'bg-emerald-600'
                                                : 'bg-emerald-800/50'
                                        } px-4 py-1.5 text-sm font-bold text-center text-white uppercase border-2 ${
                                            isPlayerReady
                                                ? 'border-emerald-500'
                                                : 'border-emerald-700'
                                        } rounded-lg transition-colors duration-200`}
                                    >
                                        {isPlayerReady && (
                                            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                                        )}
                                        {isPlayerReady ? 'Pronto' : 'Aguardando'}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`flex flex-col ${
                                        index % 2 === 0
                                            ? 'items-end'
                                            : 'items-start order-last'
                                    }`}
                                >
                                    <h3 className="text-lg text-emerald-700/60 font-medium mb-2">
                                        Aguardando...
                                    </h3>
                                    <div className="px-4 py-1.5 text-xs text-emerald-700/50 uppercase">
                                        Slot vazio
                                    </div>
                                </div>
                            )}
                            <PlayerCard player={player} index={index} isReady={isPlayerReady} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamSection;
