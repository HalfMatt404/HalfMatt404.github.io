import { players } from "./player.js";
import { canvasDimesions } from "./world-info.js";

const spacing = 200;

const headSprite = new Image();
headSprite.src = "./magician-head.png";

export function drawHurtCounters(context) {
    context.textAlign = "center";
    context.font = "30px ariel";
    const playerCount = players.length;

    players.forEach((player, index) => {
        const xPosition =
            canvasDimesions.width / 2 -
            ((playerCount - 1) * spacing) / 2 +
            index * spacing;
        context.drawImage(
            headSprite,
            xPosition - headSprite.naturalWidth / 2,
            1200,
        );
        context.fillText(player.hurtAmount, xPosition, 1200);
    });
}
