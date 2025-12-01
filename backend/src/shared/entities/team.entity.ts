export class Team<T> {
    id: string;
    players: T[];

    constructor() {
        this.id = crypto.randomUUID();
        this.players = [];
    }

    addPlayer(player: T): void {
        if (this.players.length >= 2) return;
        this.players.push(player);
    }

    removePlayer(player: T): void {
        const index = this.players.indexOf(player);
        if (index === -1) return;
        this.players.splice(index, 1);
    }

    isFull(): boolean {
        return this.players.length >= 2;
    }
}

export type Teams<T> = [Team<T>, Team<T>];
