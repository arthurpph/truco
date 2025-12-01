import { PlayerDtoOut } from 'src/player/dtos/player.dto.out';
import { Team } from 'src/shared/entities/team.entity';
import { Card } from '../entities/card.entity';
import { RoundCardPlayed } from '../types/game.type';

export type RoundEndedDtoOut =
    | {
          draw: false;
          teamWinner: Team<PlayerDtoOut>;
          cardsPlayed: RoundCardPlayed[];
      }
    | { draw: true; cardsPlayed: RoundCardPlayed[] };
