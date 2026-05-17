import { drawPlatforms } from "./platforms.js";
import { drawPlayers, playerLogic, addPlayer } from "./player.js";
import { flowerLogic, drawFlowers } from "./flower.js";
import { drawHurtCounters } from "./hurt-counter.js";

const canvas = document.getElementById("game");
const canvasDimesions = canvas.getBoundingClientRect();
const context = canvas.getContext("2d");

context.imageSmoothingEnabled = false; // Crip Pixels

document.addEventListener("DOMContentLoaded", () => {
    addPlayer(600, 500, {
        up: ["w"],
        down: ["s"],
        right: ["d"],
        left: ["a"],
        jump: ["l"],
        basicAttack: ["j"],
        flowerAttack: ["k"],
        spin: ["h"],
    });
    addPlayer(1400, 500, {
        up: ["arrowup"],
        down: ["arrowdown"],
        right: ["arrowright"],
        left: ["arrowleft"],
        jump: ["z"],
        basicAttack: ["c"],
        flowerAttack: ["x"],
        spin: ["v"],
    });
    update();
});

function update() {
    playerLogic();
    flowerLogic();

    drawBackground();
    drawPlatforms(context);
    drawFlowers(context);
    drawPlayers(context);
    drawHurtCounters(context);

    requestAnimationFrame(update);
}

function drawBackground() {
    context.clearRect(0, 0, canvasDimesions.width, canvasDimesions.height);
}
