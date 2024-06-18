import { Game } from "./game.js";

describe("game tests", () => {
    it("init test", () => {
        const game = new Game();

        game.settings = {
            gridSize: {
                columns: 4,
                rows: 6,
            },
        };

        expect(game.settings.gridSize.columns).toBe(4);
        expect(game.settings.gridSize.rows).toBe(6);
    });

    it("1 test", async () => {
        const game = new Game();

        game.settings = {
            gridSize: {
                columns: 4,
                rows: 6,
            },
        };

        expect(game.status).toBe("pending");

        await game.start();

        expect(game.status).toBe("in-process");
    });
    it("player1, player2 should have unique coordinates", async () => {
        for (let i = 0; i < 10; i++) {
            const game = new Game();
            game.settings = {
                gridSize: {
                    columns: 2,
                    rows: 3,
                },
            };

            await game.start();

            expect([1, 2]).toContain(game.player1.position.x);
            expect([1, 2, 3]).toContain(game.player1.position.y);

            expect([1, 2]).toContain(game.player2.position.x);
            expect([1, 2, 3]).toContain(game.player2.position.y);

            expect(
                game.player1.position.x !== game.player2.position.x ||
                    game.player1.position.y !== game.player2.position.y
            ).toBe(true);
        }
    });
});
