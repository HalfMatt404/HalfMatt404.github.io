import { getAnimationFrames, getLeftRightFrames } from "./animation-helper.js";
import { platforms } from "./platforms.js";
import { spawnNewFlower } from "./flower.js";
import { GRAVITY, frameRate } from "./world-info.js";

// Animations
const playerFrames = getAnimationFrames("Player", 60);
const playerIdle = getLeftRightFrames("Idle", 13);
const playerFall = getLeftRightFrames("Falling", 1);
const playerJump = getLeftRightFrames("Jump", 1);
const playerStab = getLeftRightFrames("Stab", 25);
const playerPogo = getLeftRightFrames("Pogo", 1);
const playerFlower = getLeftRightFrames("Flower", 10);
const playerWalking = getLeftRightFrames("Walking", 24);
const playerAttack = getLeftRightFrames("Attack", 11);
const playerFlail = getLeftRightFrames("Flailing", 9);
const playerAttackUp = getAnimationFrames("AttackUp", 10);

const playerStates = {
    SPINNING: "spinning",
    WALKING: "walking",
    IDLE: "idle",
    JUMPING: "jumping",
    FALLING: "falling",

    FLOWERSIDE: "flower side",
    FLOWER: "flower",

    ATTACKSIDE: "attack side",
    ATTACKUP: "attack up",
    ATTACK: "attack",

    POGO: "pogo",
    SIDEAIR: "side air",
    KNOCKEDBACK: "knocked back",
};

export class Player {
    constructor(
        x,
        y,
        inputControls = {
            jump: ["w", "arrowup"],
            up: ["w"],
            left: ["a", "arrowleft"],
            right: ["d", "arrowright"],
            down: ["s", "arrowdown"],
            flowerAttack: ["x"],
            basicAttack: ["c"],
            spin: ["z"],
        },
    ) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 150;
        this.hurtAmount = 0;

        this.xMoveDirection = 0;
        this.speed = 10;

        this.xVelocity = 0;
        this.yVelocity = 0;
        this.grounded = false;
        this.maxJumps = 2;
        this.jumps = this.maxJumps;
        this.canHoldJump = false;

        this.canInput = true;
        this.canTurn = true;
        this.canMove = true;
        this.canJump = true;
        this.animationState = playerStates.IDLE;
        this.playingAnimation = playerIdle;
        this.facingDirection = 1;
        this.frame = 0;

        this.initializeInput(inputControls);
    }
    stateMachine() {
        switch (this.animationState) {
            case playerStates.IDLE:
                toWalking(this);
                toJumping(this);
                toFalling(this);
                toSpin(this);
                break;
            case playerStates.WALKING:
                toIdle(this);
                toJumping(this);
                toFalling(this);
                break;
            case playerStates.JUMPING:
                toFalling(this);
                toWalking(this);
                toIdle(this);
                break;
            case playerStates.FALLING:
                toIdle(this);
                toWalking(this);
                toJumping(this);
                break;
            case playerStates.ATTACK:
                hitBox(
                    this.x + this.facingDirection * 100,
                    this.y - 100,
                    100,
                    200,
                    this,
                ).forEach((enemy) => {
                    if (!this.hitEnemies.includes(enemy)) {
                        enemy.damage(
                            6,
                            { x: this.facingDirection, y: 2.2 },
                            40,
                            0.1,
                        );
                        this.hitEnemies.push(enemy);
                    }
                });
                if (this.frame > this.playingAnimation.length) {
                    toIdle(this);
                    toWalking(this);
                }
                break;
            case playerStates.ATTACKUP:
                upAttack(this);
                // end of animation

                if (this.frame > this.playingAnimation.length) {
                    toIdle(this);
                    toWalking(this);
                }
                break;

            case playerStates.SIDEAIR:
                if (this.frame > 2) {
                    hitBox(
                        this.x + this.facingDirection * 100,
                        this.y - 100,
                        200,
                        200,
                        this,
                    ).forEach((enemy) => {
                        if (!this.hitEnemies.includes(enemy)) {
                            enemy.damage(
                                7,
                                { x: this.facingDirection, y: 2 },
                                30,
                                0.2,
                            );
                            this.hitEnemies.push(enemy);
                        }
                    });
                }

                // end of animation
                if (this.frame >= 5) {
                    toIdle(this);
                    toWalking(this);
                    toFalling(this);
                }
                break;
            case playerStates.ATTACKSIDE:
                const attackWidth = 200;
                const attackPositionX =
                    this.x + this.facingDirection * attackWidth;
                const attackPositionY = this.y - 50;

                if (this.frame >= 8 && this.frame <= 12) {
                    const hitEnemies = hitBox(
                        attackPositionX,
                        attackPositionY,
                        attackWidth,
                        200,
                        this,
                    );

                    hitEnemies.forEach((enemy) => {
                        if (!this.hitEnemies.includes(enemy)) {
                            enemy.damage(
                                12,
                                { x: this.facingDirection, y: 1 },
                                20,
                                0.3,
                            );
                            this.hitEnemies.push(enemy);
                        }
                    });
                }

                // end of animation
                if (this.frame >= this.playingAnimation.length) {
                    toIdle(this);
                    toWalking(this);
                }
                break;
            case playerStates.FLOWER:
            case playerStates.FLOWERSIDE:
                if (this.frame >= this.playingAnimation.length) {
                    toWalking(this);
                    toIdle(this);
                    toFalling(this);
                }
                break;
            case playerStates.POGO:
                const hitPlayers = hitBox(this.x, this.y + 15, 100, 70, this);

                hitPlayers.forEach((enemy) => {
                    enemy.damage(7, { x: 0, y: 1 }, 35, 0.1);
                });

                if (hitPlayers.length > 0) {
                    this.jumps = this.maxJumps;
                    this.yVelocity = -50;
                    toFalling(this);
                    toJumpingWithoutHoldJump(this);
                }

                toIdle(this);
                toWalking(this);
                break;

            case playerStates.SPINNING:
                break;
            case playerStates.KNOCKEDBACK:
                if (this.frame > this.stunframes / (this.grounded ? 2 : 1)) {
                    toJumping(this);
                    toFalling(this);
                    toIdle(this);
                    toWalking(this);
                }
                break;
        }

        function toSpin(player) {
            if (player.playerInput.spin.pressed) {
                player.changeState(playerStates.SPINNING, playerFrames);
            }
        }
        function toJumping(player) {
            if (player.yVelocity < 0) {
                player.changeState(playerStates.JUMPING, playerJump);
                player.onChangeState = () => {
                    player.canHoldJump = false;
                };
                player.canHoldJump = true;
            }
        }
        function toJumpingWithoutHoldJump(player) {
            if (player.yVelocity < 0) {
                player.changeState(playerStates.JUMPING, playerJump);
            }
        }

        function toWalking(player) {
            if (Math.abs(player.xMoveDirection) > 0 && player.grounded) {
                player.changeState(playerStates.WALKING, playerWalking);
            }
        }
        function toIdle(player) {
            if (Math.abs(player.xMoveDirection) < 0.1 && player.grounded) {
                player.changeState(playerStates.IDLE, playerIdle);
            }
        }

        function toFalling(player) {
            if (player.yVelocity > 0) {
                player.changeState(playerStates.FALLING, playerFall);
            }
        }
        function upAttack(player) {
            const attackPositionX = player.x;
            const attackPositionY = player.y - 210;

            if (player.frame >= 4 && player.frame <= 12) {
                const hitEnemies = hitBox(
                    attackPositionX,
                    attackPositionY,
                    350,
                    200,
                    player,
                );

                hitEnemies.forEach((enemy) => {
                    if (!player.hitEnemies.includes(enemy)) {
                        enemy.damage(
                            10,
                            { x: player.facingDirection, y: 10 },
                            40,
                            0.1,
                        );
                        player.hitEnemies.push(enemy);
                    }
                });
            }
        }
    }

    changeState(newState, newAnimation) {
        if (this.onChangeState != null) {
            this.onChangeState();
            delete this.onChangeState;
        }
        this.animationState = newState;
        this.frame = 0;
        this.playingAnimation = newAnimation;
    }

    draw(context) {
        this.stateMachine();

        // // Picking right frame
        this.frame += frameRate;
        let frameIndex = Math.floor(
            this.frame % (this.playingAnimation.length - 1),
        );
        if (this.playingAnimation.length == 1) {
            frameIndex = 0;
        }

        //
        const displayedFrame =
            this.playingAnimation[frameIndex].right ?
                this.facingDirection == 1 ?
                    this.playingAnimation[frameIndex].right
                :   this.playingAnimation[frameIndex].left
            :   this.playingAnimation[frameIndex];
        const visualWidth = displayedFrame.naturalWidth * 2;
        const visualHeight = displayedFrame.naturalHeight * 2;

        // Draw the player
        context.drawImage(
            displayedFrame,
            this.x - visualWidth / 2,
            this.y - visualHeight,
            visualWidth,
            visualHeight,
        );

        // this.drawDebug(context);
    }

    drawDebug(context) {
        context.fillStyle = "#f002";

        switch (this.animationState) {
            case playerStates.ATTACKSIDE:
                context.fillRect(
                    this.x + this.facingDirection * 200 - 100,
                    this.y - 200,
                    200,
                    200,
                );
                break;
            case playerStates.ATTACKUP:
                context.fillRect(this.x - 175, this.y - 310, 350, 200);
                break;
            case playerStates.SIDEAIR:
                context.fillRect(
                    this.x + this.facingDirection * 100 - 100,
                    this.y - 200,
                    200,
                    200,
                );
                break;
            case playerStates.ATTACK:
                context.fillRect(
                    this.x + this.facingDirection * 100 - 50,
                    this.y - 200,
                    100,
                    200,
                );
                break;
            case playerStates.POGO:
                context.fillRect(this.x - 50, this.y - 20, 100, 70);
                break;
        }
        context.fillStyle = "#ff05";
        context.fillRect(
            this.x - this.width / 2,
            this.y - this.height,
            this.width,
            this.height,
        );
    }

    logic() {
        this.yVelocity +=
            (
                GRAVITY * this.yVelocity > 0 ||
                !(this.playerInput.jump.pressed && this.canHoldJump)
            ) ?
                2
            :   1;
        if (this.grounded) {
            this.jumps = this.maxJumps;
        }
        // Player y movement
        let newYPosition = this.y + this.yVelocity;
        const onplatform = this.groundCheck(this.y, newYPosition);
        if (onplatform == null) {
            this.grounded = false;
        } else {
            this.grounded = true;
            this.y = Math.min(newYPosition, onplatform.y);
            this.standingOn = onplatform;
        }

        if (this.grounded && this.yVelocity >= 0) {
            this.yVelocity = 0;
        }

        // Player x movement
        if (this.canMove) {
            this.xVelocity += this.xMoveDirection / 2;
            if (Math.abs(this.xVelocity) < this.speed) {
                this.xVelocity = this.speed * this.xMoveDirection;
            }
        }

        this.y += this.yVelocity;
        this.x += this.xVelocity;

        if (Math.abs(this.xVelocity) > 0) {
            if (this.grounded) {
                this.xVelocity *= 0.9;
            } else {
                this.xVelocity *= 0.97;
            }
        } else {
        }

        // Orientation
        if (Math.abs(this.xMoveDirection) > 0.5 && this.canTurn) {
            this.facingDirection = this.xMoveDirection;
        }
    }

    initializeInput(keyMap) {
        this.playerInput = {
            flowerAttack: {
                key: keyMap.flowerAttack,
                onDown: flowerAttack,
            },
            basicAttack: {
                key: keyMap.basicAttack,
                onDown: basicAttack,
            },
            jump: {
                key: keyMap.jump,
                pressed: false,
                onDown: jump,
            },
            spin: {
                key: keyMap.spin,
                pressed: false,
            },
            left: {
                key: keyMap.left,
                pressed: false,
                timePressed: Date.now(),
                method: updateMovementVector,
            },
            right: {
                key: keyMap.right,
                pressed: false,
                timePressed: Date.now(),
                method: updateMovementVector,
            },
            up: {
                key: keyMap.up,
                pressed: false,
            },
            down: {
                key: keyMap.down,
                pressed: false,
            },
        };

        document.addEventListener("keydown", (event) => {
            const keyName = event.key.toLocaleLowerCase();

            for (const validInput of Object.values(this.playerInput)) {
                if (validInput.key.includes(keyName)) {
                    validInput.pressed = true;
                    validInput.timePressed = Date.now();

                    if (validInput.method) {
                        validInput.method.call(this);
                    }

                    if (validInput.onDown && this.canInput) {
                        validInput.onDown.call(this);
                    }
                }
            }
        });

        document.addEventListener("keyup", (event) => {
            const keyName = event.key.toLocaleLowerCase();

            for (const validInput of Object.values(this.playerInput)) {
                if (validInput.key.includes(keyName)) {
                    validInput.pressed = false;

                    if (validInput.method) {
                        validInput.method.call(this);
                    }
                }
            }
        });
    }

    groundCheck(currentY, newY) {
        let standingOn = null;
        platforms.forEach((platform) => {
            let xCollide = false;
            let yCollide = false;
            const shouldFallThroughPlatform =
                !this.playerInput.down.pressed ||
                platform.canPassThrough == false;
            if (
                Math.abs(this.x - platform.x) <
                    platform.width / 2 + this.width / 2 &&
                this.yVelocity >= 0
            ) {
                xCollide = true;
            }
            if (currentY <= platform.y && platform.y <= newY) {
                yCollide = true;
            }
            if (xCollide && yCollide && shouldFallThroughPlatform) {
                standingOn = platform;
            }
        });
        return standingOn;
    }

    disableInput() {
        this.canMove = false;
        this.canTurn = false;
        this.canJump = false;
        this.canInput = false;
    }
    enableInput() {
        this.canMove = true;
        this.canTurn = true;
        this.canJump = true;
        this.canInput = true;
    }

    damage(damageAmount, direction, baseKnockback, knockbackGrowth) {
        this.hurtAmount += damageAmount;

        console.log(this.hurtAmount);
        const normalizer = Math.sqrt(
            Math.pow(direction.x, 2) + Math.pow(direction.y, 2),
        );

        direction.x /= normalizer;
        direction.y /= normalizer;

        const power =
            ((this.hurtAmount / 10 + (this.hurtAmount * damageAmount) / 20) *
                1.4 +
                18) *
                knockbackGrowth +
            baseKnockback;
        if (direction != null) {
            this.xVelocity = direction.x * power;
            this.yVelocity = -direction.y * power;
        } else {
            this.yVelocity = -power;
        }

        this.stunframes = damageAmount;
        this.changeState(playerStates.KNOCKEDBACK, playerFlail);
        this.onChangeState = this.enableInput;
        this.disableInput();
    }
}

// Input functions. These will be bound to the player when called
function basicAttack() {
    // Attacks on ground
    if (this.grounded || this.animationState == playerStates.SPINNING) {
        // Up attack
        if (this.playerInput.up.pressed) {
            this.changeState(playerStates.ATTACKUP, playerAttackUp);
        }
        // Side attack
        else if (Math.abs(this.xMoveDirection) > 0) {
            this.changeState(playerStates.ATTACKSIDE, playerStab);

            this.xVelocity = this.facingDirection * 35;
        }
        // Neutral attack
        else {
            this.changeState(playerStates.ATTACK, playerAttack);
        }
        this.onChangeState = this.enableInput;
        this.disableInput();
    }
    // Air Attacks
    else {
        // Pogo attack
        if (this.playerInput.down.pressed) {
            this.changeState(playerStates.POGO, playerPogo);
        }
        // Side Swipe
        else if (Math.abs(this.xMoveDirection) > 0) {
            this.changeState(playerStates.SIDEAIR, playerAttack);
        }
        // Neutral attack
        else {
        }
    }
    this.hitEnemies = [];
}
function flowerAttack() {
    if (this.xMoveDirection == 0) {
        this.changeState(playerStates.FLOWER, playerFlower);

        spawnNewFlower(this.x - 150, this.y, 2, -1, 5, this);
        spawnNewFlower(this.x + 150, this.y, 2, 1, 5, this);
    } else {
        this.changeState(playerStates.FLOWERSIDE, playerFlower);

        spawnNewFlower(
            this.x + 300 * this.facingDirection,
            this.y,
            6,
            this.facingDirection,
            5,
            this,
        );
    }

    this.disableInput();
    this.onChangeState = this.enableInput;
}
function jump() {
    if (this.jumps > 0 && this.canJump) {
        this.yVelocity = -30;
        if (!this.grounded) {
            this.jumps--;
        }
    }
}

function updateMovementVector() {
    this.xMoveDirection = getVector(
        this.playerInput.right,
        this.playerInput.left,
    );
}

// Helper Function
function getVector(positiveInput, negativeInput) {
    return (
        positiveInput.pressed && negativeInput.pressed ?
            positiveInput.timePressed > negativeInput.timePressed ?
                1
            :   -1
        : positiveInput.pressed ? 1
        : negativeInput.pressed ? -1
        : 0
    );
}

export function hitBox(x, y, width, height, player) {
    const hitEnemies = [];

    players.forEach((enemy) => {
        if (enemy != player || player == null) {
            if (
                Math.abs(x - enemy.x) < width / 2 + enemy.width / 2 &&
                Math.abs(y - (enemy.y - enemy.height / 2)) <
                    height / 2 + enemy.height / 2
            ) {
                hitEnemies.push(enemy);
            }
        }
    });

    return hitEnemies;
}

// Exports
export const players = [];

export function addPlayer(
    x,
    y,
    inputControls = {
        jump: ["w", "arrowup"],
        left: ["a", "arrowleft"],
        right: ["d", "arrowright"],
        down: ["s", "arrowdown"],
        flowerAttack: ["x"],
        spin: ["z"],
    },
) {
    players.push(new Player(x, y, inputControls));
}
export function drawPlayers(context) {
    players.forEach((playerCharacter) => {
        playerCharacter.draw(context);
    });
}
export function playerLogic() {
    players.forEach((playerCharacter) => {
        playerCharacter.logic();
    });
}
