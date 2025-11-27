import { PlayerDtoOut } from 'src/player/dtos/player.dto.out';
import { Team } from 'src/shared/entities/team.entity';
import { Card } from '../entities/card.entity';

export type RoundEndedDtoOut =
    | {
          draw: false;
          teamWinner: Team<PlayerDtoOut>;
          cardsPlayed: Card[];
      }
    | { draw: true; cardsPlayed: Card[] };
