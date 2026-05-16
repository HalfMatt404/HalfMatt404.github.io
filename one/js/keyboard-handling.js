import { gameState, gamesStates, resume, initializeGame, playerIsAlive, paused, pause, normalizeVector } from "./main.js";

// Keyboard handling

export let movementVector = {
    x: 0,
    y: 0,
};
let directionInput = {
    up: {
        key: ["arrowup", "w"],
        pressed: false,
        timePressed: Date.now(),
    },
    down: {
        key: ["arrowdown", "s"],
        pressed: false,
        timePressed: Date.now(),
    },
    left: {
        key: ["arrowleft", "a"],
        pressed: false,
        timePressed: Date.now(),
    },
    right: {
        key: ["arrowright", "d"],
        pressed: false,
        timePressed: Date.now(),
    },
};
document.addEventListener("keydown", (event) => {
    const keyName = event.key.toLocaleLowerCase();

    if (gameState == gamesStates.WAITING) {
        resume();
    }

    if (gameState == gamesStates.GAMEOVER && keyName == "r") {
        initializeGame();
        resume();
    }

    if (keyName == "escape" && playerIsAlive()) {
        if (paused) resume();
        else pause();
    }

    for (const validInput of Object.values(directionInput)) {
        if (validInput.key.includes(keyName)) {
            validInput.pressed = true;
            validInput.timePressed = Date.now();
        }
        updateMovementVector();
    }
});
document.addEventListener("keyup", (event) => {
    const keyName = event.key.toLocaleLowerCase();

    for (const value of Object.values(directionInput)) {
        if (value.key.includes(keyName)) {
            value.pressed = false;
        }
        updateMovementVector();
    }
});
function updateMovementVector() {
    const normalizedInput = normalizeVector(
        getVector(directionInput.right, directionInput.left),
        getVector(directionInput.down, directionInput.up)
    );
    movementVector = normalizedInput;
}
function getVector(positiveInput, negativeInput) {
    return (
        positiveInput.pressed && negativeInput.pressed ?
            positiveInput.timePressed > negativeInput.timePressed ?
                1
                : -1
            : positiveInput.pressed ? 1
                : negativeInput.pressed ? -1
                    : 0
    );
}
