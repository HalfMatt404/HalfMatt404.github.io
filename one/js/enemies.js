import {
    damagePlayer,
    lerpAngle,
    checkCollision,
    toPlayer,
    delta,
    canvasDimesions,
    enemies,
} from "./main.js";
import { drawCenteredRect } from "./draw-functions.js";
// Enemies/projectiles

export class Enemy {
    constructor(x, y, directionX, directionY, duration, width, height, damage) {
        this.x = x;
        this.y = y;

        this.directionX = directionX;
        this.directionY = directionY;
        this.duration = duration;
        this.width = width;
        this.height = height;
        this.damage = damage;
    }

    draw(context) {}

    logic() {}
}

export class CannonBall extends Enemy {
    constructor() {
        const spawnPoint = getValidSpawnPoint();
        const x = spawnPoint.x;
        const y = spawnPoint.y;

        const directionToPlayer = toPlayer(x, y);
        const directionX = directionToPlayer.x;
        const directionY = directionToPlayer.y;

        const width = 40;
        const height = width;
        const damage = 20;

        super(x, y, directionX, directionY, 15, width, height, damage);
    }

    draw(context) {
        context.fillStyle = "#f00";

        context.beginPath();
        context.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI);
        context.fill();
    }

    logic() {
        this.speed = 100;
        // Move
        this.x += this.directionX * this.speed * delta;
        this.y += this.directionY * this.speed * delta;

        // Deletion
        let shouldRemove = false;
        if (checkCollision(this)) {
            damagePlayer(this.damage);

            shouldRemove = true;
        }

        this.duration -= delta;
        if (this.duration <= 0) {
            shouldRemove = true;
        }

        if (shouldRemove) {
            removeEnemy(this);
        }
    }
}

export class FollowTriangle extends Enemy {
    constructor() {
        const spawnPoint = getValidSpawnPoint();
        const x = spawnPoint.x;
        const y = spawnPoint.y;

        const directionToPlayer = toPlayer(x, y);
        const directionX = directionToPlayer.x;
        const directionY = directionToPlayer.y;

        const width = 10;
        const height = 20;
        const damage = 10;

        super(x, y, directionX, directionY, 15, width, height, damage);

        this.speed = 200;
    }

    draw(context) {
        context.fillStyle = "#0f0";

        const facing = toPlayer(this.x, this.y);
        const angle = Math.atan2(facing.y, facing.x) - (90 * Math.PI) / 180;

        // Draw triangle at location with rotation
        context.translate(this.x, this.y);
        context.rotate(angle);
        // Triangle part
        context.beginPath();
        context.moveTo(-this.width, -this.height / 2);
        context.lineTo(this.width, -this.height / 2);
        context.lineTo(0, this.height / 2);
        context.closePath();

        context.fill();
        context.rotate(-angle);
        context.translate(-this.x, -this.y);
    }

    logic() {
        const turnIncrement = 30;
        const desiredVector = toPlayer(this.x, this.y);
        const currentAngle = Math.atan2(this.directionY, this.directionX);
        const desiredAngle = Math.atan2(desiredVector.y, desiredVector.x);

        const newAngle = lerpAngle(currentAngle, desiredAngle, turnIncrement);

        this.directionX = Math.cos(newAngle);
        this.directionY = Math.sin(newAngle);

        // Move
        this.x += this.directionX * this.speed * delta;
        this.y += this.directionY * this.speed * delta;

        // Deletion
        let shouldRemove = false;
        if (checkCollision(this)) {
            damagePlayer(this.damage);

            shouldRemove = true;
        }

        this.duration -= delta;
        if (this.duration <= 0) {
            shouldRemove = true;
        }

        if (shouldRemove) {
            removeEnemy(this);
        }
    }
}

export class BlueBlock extends Enemy {
    constructor() {
        const direction = Math.round(Math.random()) == 1;

        const y = Math.random() * canvasDimesions.height;
        const x = direction ? -20 : canvasDimesions.width + 20;

        const directionX = direction ? 1 : -1;
        const directionY = 0;

        const width = 30;
        const height = canvasDimesions.height / 2;
        const damage = 50;

        super(x, y, directionX, directionY, 15, width, height, damage);

        this.hasHit = false;
    }

    draw(context) {
        if (this.hasHit) {
            context.fillStyle = "rgba(4, 0, 255, 0.05)";
        } else {
            context.fillStyle = "rgb(0, 225, 255)";
        }

        drawCenteredRect(context, this.x, this.y, this.width, this.height);
    }

    logic() {
        // Move
        this.x += this.directionX;

        // Collision
        if (checkCollision(this) && this.hasHit == false) {
            damagePlayer(this.damage);

            this.hasHit = true;
        }

        // Deletion
        this.duration -= delta;
        if (this.duration <= 0) {
            removeEnemy(this);
        }
    }
}

// Enemy Handling
export function removeEnemy(enemy) {
    enemies.splice(enemies.indexOf(enemy), 1);
}

function getValidSpawnPoint() {
    let validPosition = {
        x: 0,
        y: 0,
    };
    let halfBiggerDimension =
        Math.max(canvasDimesions.height, canvasDimesions.width) / 2;

    // Find valid spawn
    let randomAngle = Math.random() * 360;
    let randomRadians = randomAngle * (Math.PI / 180);
    let spawnPadding = 100;

    // Set position
    validPosition.x =
        Math.cos(randomRadians) * (halfBiggerDimension + spawnPadding) +
        canvasDimesions.width / 2;
    validPosition.y =
        Math.sin(randomRadians) * (halfBiggerDimension + spawnPadding) +
        canvasDimesions.height / 2;

    return validPosition;
}
