import { motion } from 'framer-motion';

interface GameInfoProps {
    playerCount: number;
    roundValue: number;
}

const GameInfo: React.FC<GameInfoProps> = ({ playerCount, roundValue }) => {
    return (
        <motion.div
            className="absolute top-8 right-8 bg-emerald-900/60 backdrop-blur-sm rounded-xl p-4 border-2 border-emerald-700/50"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">Jogadores:</span>
                    <span className="text-white">{playerCount}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">
                        Valor da rodada:
                    </span>
                    <span className="text-white text-xl font-bold">
                        {roundValue}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default GameInfo;
