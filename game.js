export class Game {
    #settings = {
        pointsToWin: 10,
        gridSize: {
            columns: 4,
            rows: 4,
        },
        googleJumpInterval: 2000,
    };
    #status = "pending";
    #player1;
    #player2;
    #google;
    #googleJumpIntervalId;
    #score = {
        1: {points: 0},
        2: {points: 0}
    }

    #getRandomPosition(existedPosition = []) {
        let newX;
        let newY;

        do {
            newX = NumberUtil.getRandomNumber(this.#settings.gridSize.columns);
            newY = NumberUtil.getRandomNumber(this.#settings.gridSize.rows);
        } while (
            existedPosition.some((pos) => newX === pos.x && newY === pos.y)
        );

        return new Position(newX, newY);
    }

    #moveGoogleToRandomPosition(excludedGoogle) {
        let occupiedPositions = [
            this.#player1.position,
            this.#player2.position,
        ];

        if (!excludedGoogle) {
            occupiedPositions.push(this.#google.position);
        }

        this.#google = new Google(this.#getRandomPosition(occupiedPositions));
    }

    #createUnits() {
        const player1Position = this.#getRandomPosition();
        this.#player1 = new Player(1, player1Position);

        const player2Position = this.#getRandomPosition([player1Position]);
        this.#player2 = new Player(2, player2Position);

        this.#moveGoogleToRandomPosition(true);
    }

    set settings(settings) {
        this.#settings = {...this.#settings, ...settings}
        this.#settings.gridSize = {...this.#settings.gridSize, ...settings.gridSize}
    }
    get settings() {
        return this.#settings;
    }
    get status() {
        return this.#status;
    }
    get player1() {
        return this.#player1;
    }
    get player2() {
        return this.#player2;
    }
    get google() {
        return this.#google;
    }
    get score() {
        return this.#score;
    }

    async start() {
        if (this.#status === "pending") {
            this.#status = "in-process";
            this.#createUnits();
        }
        this.#googleJumpIntervalId = setInterval(() => {
            this.#moveGoogleToRandomPosition();
        }, this.#settings.googleJumpInterval);
    }

    async stop() {
        this.#status = "finished";
        clearInterval(this.#googleJumpIntervalId);
    }

    #checkBorder(player, delta) {
        const newPos = player.position.clone()

        if (delta.x) newPos.x += delta.x
        if (delta.y) newPos.y += delta.y

        if (newPos.x >= 1 || newPos.x <= this.#settings.gridSize.columns) return false
        if (newPos.y >= 1 || newPos.y <= this.#settings.gridSize.rows) return false
        
        return true
    }
    #checkAnotherPlayer(movingPlayer, anotherPlayer, delta) {
        const newPos = movingPlayer.position.clone()

        if (delta.x) newPos.x += delta.x
        if (delta.y) newPos.y += delta.y

        return newPos.equal(anotherPlayer.position)
    }
    #checkGoogleCatching(player) {
        if (player.position.equal(this.#google.position)) {
            this.#score[player.id].points++

            if (this.#score[player.id].points === this.#settings.pointsToWin) {
                this.stop();
                this.#google = new Google(new Position(0,0))
            }

            this.#moveGoogleToRandomPosition()
        }
    }
    #movePlayer(movingPlayer, anotherPlayer, delta) {
        const isBoreder = this.#checkBorder(movingPlayer, delta)
        const isAnotherPlayer = this.#checkAnotherPlayer(movingPlayer, anotherPlayer, delta)
        
        if (isBoreder || isAnotherPlayer) return

        if (delta.x) {
            movingPlayer.position = new Position(movingPlayer.position.x + delta.x, movingPlayer.position.y)
        }
        if (delta.y) {
            movingPlayer.position = new Position(movingPlayer.position.x, movingPlayer.position.y + delta.y)
        }

        this.#checkGoogleCatching(movingPlayer)
    }

    movePlayer1Left() {
        const delta = { x: -1 };
        this.#movePlayer(this.#player1, this.#player2, delta)
    }
    movePlayer1Right() {
        const delta = { x: 1 };
        this.#movePlayer(this.#player1, this.#player2, delta)
    }
    movePlayer1Up() {
        const delta = { y: -1 };
        this.#movePlayer(this.#player1, this.#player2, delta)
    }
    movePlayer1Down() {
        const delta = { y: 1 };
        this.#movePlayer(this.#player1, this.#player2, delta)
    }

    movePlayer2Left() {
        const delta = { x: -1 };
        this.#movePlayer(this.#player2, this.#player1, delta)
    }
    movePlayer2Right() {
        const delta = { x: 1 };
        this.#movePlayer(this.#player2, this.#player1, delta)
    }
    movePlayer2Up() {
        const delta = { y: -1 };
        this.#movePlayer(this.#player2, this.#player1, delta)
    }
    movePlayer2Down() {
        const delta = { y: 1 };
        this.#movePlayer(this.#player2, this.#player1, delta)
    }
}

class Unit {
    constructor(position) {
        this.position = position;
    }
}

class Player extends Unit {
    constructor(id, position) {
        super(position);
        this.id = id;
    }
}
class Google extends Unit {
    constructor(position) {
        super(position);
    }
}

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Position(this.x, this.y);
    }
    equal(anotherPosition) {
        return anotherPosition.x === this.x && anotherPosition.y === this.y;
    }
}

class NumberUtil {
    static getRandomNumber(max) {
        return Math.floor(Math.random() * max + 1);
    }
}
