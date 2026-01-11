import { CardDTO, PlayerDTO } from '../../../types/dtos.ts';
import { RoundEndedDTO } from '../game.dto.ts';

export type GameState = {
    currentPlayer: PlayerDTO | null;
    myHand: CardDTO[];
    playedCards: Array<{ playerId: string; card?: CardDTO; isDark: boolean }>;
    roundValue: number;
    trucoRequest: {
        from: string;
        fromName: string;
        to: string;
        toName: string;
        points: number;
    } | null;
    isMyTurn: boolean;
    roundEnded: boolean;
    roundEndedData: RoundEndedDTO | null;
};
