import {
    drawInstructions,
    drawBackGround,
    drawWaveText,
    drawEnemies,
    drawPlayer,
    drawScore,
    drawHitEffects,
    drawGameOver,
    drawPauseScreen,
    drawRestartPrompt,
    drawHealEffects,
} from "./draw-functions.js";
import { CannonBall, BlueBlock, FollowTriangle } from "./enemies.js";
import { movementVector } from "./keyboard-handling.js";

const canvas = document.getElementById("game");
const characterCanvas = canvas.cloneNode();
export const canvasDimesions = canvas.getBoundingClientRect();
export const context = canvas.getContext("2d");
const characterContext = characterCanvas.getContext("2d");

const playerStartValues = {
    maxHealth: 100,
    health: 100,
    x: canvasDimesions.width / 2,
    y: canvasDimesions.height / 2,
    width: 20,
    height: 20,
    speed: 200,
    speedMultiplier: 1,
    hitThisFrame: false,
    healedThisFrame: false,
    angle: 0,
};

// Main Game Loop
let incrementMS = 10;
export let delta = incrementMS / 1000;

export let timeSurvived;
export let paused;
export let enemies;
let enemyTimer;

export let player;
let lastFrame;

let gameLoop;
export let gameState;

export const gamesStates = {
    WAITING: "waiting",
    RUNNING: "running",
    GAMEOVER: "game over",
};

window.addEventListener("load", () => {
    initializeGame();
    update();
    drawInstructions(context);
});
function update() {
    delta = (Date.now() - lastFrame) / 1000;
    lastFrame = Date.now();

    timeSurvived += delta;

    playerMovement();
    enemyLogic();

    waveHandler();

    // Draw to screen
    drawBackGround(characterContext);
    drawEnemies(characterContext);
    drawPlayer(characterContext);

    if (player.healedThisFrame) {
        drawHealEffects(characterContext);
        stopTime();
        setTimeout(() => {
            resume();
        }, 200);
        player.healedThisFrame = false;
    }

    context.drawImage(characterCanvas, 0, 0);

    drawWaveText(context);
    if (player.hitThisFrame) {
        drawHitEffects(context);
        player.hitThisFrame = false;
    }

    if (!playerIsAlive()) {
        drawGameOver(context);
    }
}

export function initializeGame() {
    player = structuredClone(playerStartValues);
    enemies = [];

    wave = 1;
    intermissionTimer = intermissionLength;

    enemyTimer = 0;
    timeSurvived = 0;

    lastFrame = Date.now();
    gameState = gamesStates.WAITING;
    update();
}
function stopTime() {
    clearInterval(gameLoop);
}
export function pause() {
    drawPauseScreen(context);

    paused = true;
    stopTime();
}
export function resume() {
    gameState = gamesStates.RUNNING;
    paused = false;
    lastFrame = Date.now();
    gameLoop = setInterval(update, incrementMS);
}

// Player
export const playerIsAlive = () => player.health > 0;

function healPlayer(amount) {
    player.healedThisFrame = true;
    player.health = Math.min(player.health + amount, player.maxHealth);
}
export function damagePlayer(amount) {
    player.health -= amount;
    player.hitThisFrame = true;

    const freezeDuration = 200 + (amount - 20) * 10;

    // Resume play after delay
    stopTime();
    if (playerIsAlive()) {
        setTimeout(() => {
            resume();
        }, freezeDuration);
    } else {
        playerDeath();
    }
}

function playerDeath() {
    setTimeout(() => {
        gameState = gamesStates.GAMEOVER;
        drawRestartPrompt(context);
    }, 500);
}

function playerMovement() {
    const speed = player.speed * player.speedMultiplier;
    const newPosition = {
        x: player.x + movementVector.x * speed * delta,
        y: player.y + movementVector.y * speed * delta,
    };

    player.x = wrap(newPosition.x, canvasDimesions.width);
    player.y = wrap(newPosition.y, canvasDimesions.height);

    if (player.speedMultiplier > 1) {
        player.speedMultiplier = Math.max(player.speedMultiplier - delta, 1);
    }
}
function wrap(position, max) {
    const wrapPadding = 40;

    const halfMax = max / 2;
    let distanceFromCenter = halfMax - position;

    if (Math.abs(distanceFromCenter) > halfMax + wrapPadding) {
        position = halfMax + distanceFromCenter * 0.95;
    }

    return position;
}

export function toPlayer(x, y) {
    let directionToPlayer = {
        x: player.x - x,
        y: player.y - y,
    };

    directionToPlayer = normalizeVector(
        directionToPlayer.x,
        directionToPlayer.y,
    );

    return directionToPlayer;
}

export function normalizeVector(x, y) {
    let normal = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    if (normal == 0) {
        normal = 1; // prevent divide by 0
    }

    return {
        x: x / normal,
        y: y / normal,
    };
}

export function checkCollision(collisionOject) {
    let xDistance = collisionOject.x - player.x;
    let yDistance = collisionOject.y - player.y;

    let collideDistanceX = collisionOject.width / 2 + player.width / 2;
    let collideDistanceY = collisionOject.height / 2 + player.height / 2;

    const didCollide =
        Math.abs(xDistance) <= collideDistanceX &&
        Math.abs(yDistance) <= collideDistanceY;

    return didCollide;
}

export function lerpAngle(currentAngle, desiredAngle, turnRateDegrees = 270) {
    const TAU = 2 * Math.PI;
    const angleIncrement = (turnRateDegrees / 360) * TAU * delta;

    const clockWise = (2 * TAU + desiredAngle - currentAngle) % TAU;
    const counterClockWise = (3 * -TAU + desiredAngle - currentAngle) % TAU;
    const sign = Math.abs(counterClockWise) > clockWise ? 1 : -1;

    let returnAngle;
    if (Math.abs(desiredAngle - currentAngle) < 2 * angleIncrement) {
        returnAngle = desiredAngle;
    } else {
        returnAngle = (currentAngle + angleIncrement * sign) % TAU;
    }
    return returnAngle;
}

let waveTimer;
let waveLength = 20;
let intermissionLength = 5;
let intermissionTimer;
export let wave;

let waveInProgress = () => waveTimer > 0;
export let intermissionInProgress = () => intermissionTimer > 0;

function waveHandler() {
    enemyTimer += delta;

    if (waveInProgress()) {
        waveTimer -= delta;
        spawnLogic();
        // start intermission
        if (!waveInProgress()) {
            wave++;
            intermissionTimer = intermissionLength;
            healPlayer(20);
            // Remove all current enemies
            enemies.forEach((enemy) => {
                enemy.duration = 0;
            });
        }
    } else if (intermissionInProgress()) {
        intermissionTimer -= delta;
        if (!intermissionInProgress()) {
            waveTimer = waveLength;
        }
    }
}

function enemyLogic() {
    enemies.forEach((enemy) => {
        enemy.logic();
    });
}

function spawnLogic() {
    enemySpawners.forEach((spawner) => {
        const max = spawner.spawnInterval - spawner.spawnIntervalCap;
        const crease =
            (wave - spawner.startSpawning) * spawner.spawnRateIncrease;
        const spawnRate = spawner.spawnInterval - Math.min(crease, max);

        if (wave > spawner.startSpawning) {
            if (spawner.timer > spawnRate) {
                spawner.timer = 0;
                spawner.spawnFunction();
            }
            spawner.timer += delta;
        }
    });
}

function spawnCanonEnemy() {
    enemies.push(new CannonBall());
}
function spawnTriangleEnemy() {
    enemies.push(new FollowTriangle());
}
function spawnBlueEnemy() {
    enemies.push(new BlueBlock());
}

const enemySpawners = [
    {
        startSpawning: 0,
        timer: 0,
        spawnInterval: 2,
        spawnRateIncrease: 0.1,
        spawnIntervalCap: 0.4,
        spawnFunction: spawnCanonEnemy,
    },
    {
        startSpawning: 1,
        timer: 0,
        spawnInterval: 1,
        spawnRateIncrease: 0.075,
        spawnIntervalCap: 0.4,
        spawnFunction: spawnTriangleEnemy,
    },
    {
        startSpawning: 2,
        timer: 0,
        spawnInterval: 4,
        spawnRateIncrease: 0.2,
        spawnIntervalCap: 2,
        spawnFunction: spawnBlueEnemy,
    },
];
