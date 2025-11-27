import { Card } from '../entities/card.entity';

type BaseDto = {
    playerId: string;
    currentPlayer: string;
};

export type CardPlayedDtoOut =
    | ({
          isDark: false;
          card: Card;
      } & BaseDto)
    | ({
          isDark: true;
      } & BaseDto);
