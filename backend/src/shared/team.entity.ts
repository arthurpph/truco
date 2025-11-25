import { Player } from 'src/player/player.entity';

export class Team {
    players: [Player, Player];

    constructor(player1: Player, player2: Player) {
        this.players = [player1, player2];
    }
}
