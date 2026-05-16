import {
    player,
    lerpAngle,
    context,
    enemies,
    canvasDimesions,
    wave,
    timeSurvived,
    delta,
    intermissionInProgress,
} from "./main.js";
import { movementVector } from "./keyboard-handling.js";

const rImage = new Image();
rImage.src = "./images/R.svg";
const wasdImage = new Image();
wasdImage.src = "./images/WASD.svg";

// Draw
export function drawPlayer(context) {
    const desiredAngle = Math.atan2(movementVector.y, movementVector.x);

    if (movementVector.x != 0 || movementVector.y != 0) {
        player.angle = lerpAngle(player.angle, desiredAngle);
    }

    const percentHealth = 1 - player.health / player.maxHealth;

    context.translate(player.x, player.y);
    context.rotate(player.angle);

    context.fillStyle = "#000";
    drawCenteredRect(context, 0, 0, player.width, player.height);

    context.fillStyle = "#fff";
    drawCenteredRect(
        context,
        0,
        0,
        player.width * Math.sqrt(percentHealth),
        player.height * Math.sqrt(percentHealth),
    );
    context.rotate(-player.angle);
    context.translate(-player.x, -player.y);
}
export function drawEnemies(context) {
    enemies.forEach((enemy) => {
        enemy.draw(context);
    });
}
export function drawBackGround(context) {
    // transparency progressivly fades previous frames
    context.fillStyle = `#ffffff17`;
    context.fillRect(0, 0, canvasDimesions.width, canvasDimesions.height);
}
export function drawHitEffects(context) {
    context.fillStyle = "#000a";
    context.fillRect(0, 0, canvasDimesions.width, canvasDimesions.height);
    // Player overlay
    const angle = player.angle;

    context.translate(player.x, player.y);
    context.rotate(angle);

    context.fillStyle = "#ff004cfc";
    let info = player;
    drawCenteredRect(context, 0, 0, info.width * 1.1, info.height * 1.1);

    context.rotate(-angle);
    context.translate(-player.x, -player.y);
}
export function drawHealEffects(context) {
    const gradient = context.createRadialGradient(
        canvasDimesions.width / 2,
        canvasDimesions.height / 2,

        canvasDimesions.height / 5,
        canvasDimesions.width / 2,
        canvasDimesions.height / 2,
        canvasDimesions.width * 0.8,
    );
    gradient.addColorStop(0, "#0000");
    gradient.addColorStop(1, "rgba(187, 255, 0, 0.74)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvasDimesions.width, canvasDimesions.height);
}
export function drawInstructions(context) {
    context.fillStyle = "#000";
    context.font = "20px bold";
    context.textAlign = "center";
    context.fillText(
        "           or Arrow Keys",
        canvasDimesions.width / 2,
        canvasDimesions.height / 2 + 50,
    );
    context.drawImage(wasdImage, player.x - 125, player.y + 5, 80, 80);
}
export function drawRestartPrompt(context) {
    context.textAlign = "Center";

    context.font = "20px bold";
    context.fillStyle = "#fff";
    context.fillText("R to Restart", player.x, player.y + 35);
}
export function drawPauseScreen(context) {
    context.fillStyle = "#000a";
    context.fillRect(0, 0, canvasDimesions.width, canvasDimesions.height);

    context.textAlign = "center";

    context.fillStyle = "#fff";
    context.font = "100px bold";
    context.fillText(
        "PAUSED",
        canvasDimesions.width / 2,
        canvasDimesions.height / 2 - 100,
    );

    context.fillStyle = "#fffa";
    context.font = "30px bold";
    context.fillText(
        "Esc To Resume",
        canvasDimesions.width / 2,
        canvasDimesions.height / 2 - 60,
    );
}

let waveTextSize = 100;
let waveTextY = 50;
export function drawWaveText(context) {
    const scaler = () => (waveTextY - 70) / (canvasDimesions.height / 2) + 0.2;

    if (intermissionInProgress()) {
        waveTextY = canvasDimesions.height / 2;
    } else if (waveTextY > 70) {
        waveTextY -= delta * 500 * scaler();
        waveTextY = Math.max(70, waveTextY);
    }

    context.fillStyle = "#888";
    context.fillStyle = `rgba(136,136,136,${scaler()})`;
    context.font = `${waveTextSize * scaler()}px Arial`;
    context.textAlign = "center";
    context.fillText(`Wave ${wave}`, canvasDimesions.width / 2, waveTextY - 20);
}
export function drawGameOver(context) {
    context.fillStyle = "#0004";
    context.fillRect(0, 0, canvasDimesions.width, canvasDimesions.height);

    context.font = "100px Arial bold";
    context.fillStyle = "#fff";
    context.textAlign = "center";
    context.fillText(
        `GAME OVER`,
        canvasDimesions.width / 2,
        canvasDimesions.height / 2 - 100,
    );

    context.fillStyle = "#fffa";
    context.font = "2em Arial";
    context.fillText(
        `You Lived ${
            timeSurvived < 15 ? "for Only"
            : timeSurvived < 30 ? "a Mediocre"
            : timeSurvived < 120 ? "a good"
            : "an Excellant"
        } ${Math.floor(timeSurvived)} Seconds`,
        canvasDimesions.width / 2,
        canvasDimesions.height / 2 - 60,
    );
}
export function drawScore(context) {
    context.textAlign = "left";
    context.font = "25px Arial";
    context.fillStyle = "#000";
    context.fillText(`Time Alive: ${Math.floor(timeSurvived)}`, 20, 35);
}
export function drawCenteredRect(context, x, y, width, height) {
    context.fillRect(x - width / 2, y - height / 2, width, height);
}
