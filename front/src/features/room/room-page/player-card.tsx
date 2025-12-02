import { Player } from "../../../types/models";

const PlayerCard = ({
    player,
    index,
    isReady = false,
}: {
    player: Player | null;
    index: number;
    isReady?: boolean;
}) => (
    <div
        className={`flex flex-col items-center justify-center gap-4 ${
            index % 2 == 0 ? 'ml-auto' : 'mr-auto'
        }`}
    >
        <div className="relative">
            <div
                className={`w-32 h-32 rounded-full border-4 transition-all duration-300 ${
                    player 
                        ? isReady 
                            ? 'border-emerald-400 shadow-lg shadow-emerald-500/30' 
                            : 'border-amber-500' 
                        : 'border-emerald-700/50 opacity-60'
                }`}
                style={{
                    backgroundImage: player
                        ? "url('/src/assets/playerimage.png')"
                        : "url('/src/assets/avatarvazio.png')",
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            ></div>
            {player && isReady && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-emerald-400">
                    <span className="text-white text-sm">✓</span>
                </div>
            )}
        </div>
    </div>
);

export default PlayerCard;
