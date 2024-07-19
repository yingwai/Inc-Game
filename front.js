import { Game } from "./game.js";
import { EventEmitter } from "./eventEmitter.js";

const eventEmitter = new EventEmitter();
const game = new Game(eventEmitter);

game.settings = { pointsToWin: 3 };

await game.start();

const tableElement = document.querySelector("#grid");
const scoreElement = document.querySelector("#score");

window.addEventListener("keydown", (e) => {
    console.log(e);
    switch (e.code) {
        case "ArrowLeft":
            game.movePlayer1Left();
            break;
        case "ArrowRight":
            game.movePlayer1Right();
            break;
        case "ArrowUp":
            game.movePlayer1Up();
            break;
        case "ArrowDown":
            game.movePlayer1Down();
            break;
        case "KeyA":
            game.movePlayer2Left();
            break;
        case "KeyD":
            game.movePlayer2Right();
            break;
        case "KeyW":
            game.movePlayer2Up();
            break;
        case "KeyS":
            game.movePlayer2Down();
            break;
    }
});

function render() {
    tableElement.innerHTML = "";
    scoreElement.innerHTML = "";

    const {
        settings: { gridSize },
        player1,
        player2,
        google,
        score,
    } = game;

    scoreElement.append(
        `player1: ${score[player1.id].points} player2: ${
            score[player2.id].points
        }`
    );

    for (let y = 1; y <= gridSize.rows; y++) {
        const trElement = document.createElement("tr");

        for (let x = 1; x <= gridSize.columns; x++) {
            const tdElement = document.createElement("td");

            if (player1.position.x === x && player1.position.y === y) {
                const imgElement = document.createElement("img");
                imgElement.src = "./assets/player1.png";

                tdElement.appendChild(imgElement);
            }
            if (player2.position.x === x && player2.position.y === y) {
                const imgElement = document.createElement("img");
                imgElement.src = "./assets/player2.png";

                tdElement.appendChild(imgElement);
            }
            if (google.position.x === x && google.position.y === y) {
                const imgElement = document.createElement("img");
                imgElement.src = "./assets/google.png";

                tdElement.appendChild(imgElement);
            }

            trElement.appendChild(tdElement);
        }

        tableElement.appendChild(trElement);
    }
}

game.eventEmitter.subscribe("changePosition", render);

render();
