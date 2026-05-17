const flowers = [];
import { platforms } from "./platforms.js";
import { frameRate } from "./world-info.js";
import { hitBox } from "./player.js";
import { getAnimationFrames } from "./animation-helper.js";

const flowerFrames = getAnimationFrames("Flower", 34);
export class Flower {
    constructor(x, y, more, direction, damage, owner) {
        this.frame = 0;
        this.x = x;
        this.y = y;

        this.more = more;
        this.direction = direction;
        this.spawned = false;

        this.damage = damage;
        this.owner = owner;

        this.hitEnemies = [];
    }

    logic() {
        if (this.frame > 2) {
            if (this.more > 0 && !this.spawned) {
                spawnNewFlower(
                    this.x + 130 * this.direction,
                    this.y,
                    this.more - 1,
                    this.direction,
                    this.damage,
                    this.owner,
                );
                this.spawned = true;
            }
        }

        if (this.frame > 10 && this.frame <= 15) {
            const hitPlayers = hitBox(
                this.x,
                this.y - 75,
                100,
                150,
                this.owner,
            );

            hitPlayers.forEach((enemy) => {
                if (!this.hitEnemies.includes(enemy)) {
                    this.hitEnemies.push(enemy);
                    enemy.damage(
                        this.damage,
                        {
                            x: this.direction,
                            y: 0.2,
                        },
                        20,
                        0,
                    );
                }
            });
        }

        if (this.frame < 70) {
            this.frame += frameRate;
        } else {
            flowers.splice(flowers.indexOf(this), 1);
        }
    }

    draw(context) {
        context.drawImage(
            flowerFrames[
                Math.min(Math.floor(this.frame), flowerFrames.length - 1)
            ],
            this.x - 82,
            this.y - 216,
            164,
            216,
        );

        // Debug
        // context.fillStyle = "#f002";
        // if (this.frame > 10 && this.frame <= 15) {
        //     context.fillStyle = "#f00a";
        // }
        // context.fillRect(this.x - 25, this.y - 150, 100, 150);
    }
}

export function flowerLogic() {
    flowers.forEach((flower) => {
        flower.logic();
    });
}
export function drawFlowers(context) {
    flowers.forEach((flower) => {
        flower.draw(context);
    });
}

export function spawnNewFlower(x, y, more, direction, damage, owner) {
    const platformY = findPlatformBelow(x, y, 100);
    flowers.push(new Flower(x, platformY, more, direction, damage, owner));
}

function findPlatformBelow(x, y, width = 0) {
    const platformsHeights = [];
    platforms.forEach((platform) => {
        let xCollide = false;
        let yCollide = false;
        if (Math.abs(x - platform.x) < platform.width / 2 + width / 2) {
            xCollide = true;
        }
        if (y <= platform.y) {
            yCollide = true;
        }
        if (xCollide && yCollide) {
            platformsHeights.push(platform.y);
        }
    });

    return Math.min(...platformsHeights);
}
