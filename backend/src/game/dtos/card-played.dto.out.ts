import { PlayerDtoOut } from 'src/player/dtos/player.dto.out';
import { Card } from '../entities/card.entity';

type BaseDto = {
    playerId: string;
    currentPlayer: PlayerDtoOut;
};

export type CardPlayedDtoOut =
    | ({
          isDark: false;
          card: Card;
      } & BaseDto)
    | ({
          isDark: true;
      } & BaseDto);
