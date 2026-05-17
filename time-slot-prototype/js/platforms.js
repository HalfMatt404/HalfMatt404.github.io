export let platforms = [
    { x: 200, y: 700, width: 400 },
    { x: 1800, y: 700, width: 400 },
    { x: 1000, y: 700, width: 200 },
    { x: 1000, y: 1000, width: 1700, canPassThrough: false },
];
export function drawPlatforms(context) {
    platforms.forEach((platform) => {
        context.fillStyle = "#635858";
        context.fillRect(
            platform.x - platform.width / 2,
            platform.y - 10,
            platform.width,
            20,
        );
        context.fillStyle = "#2f2626";
        context.fillRect(
            platform.x - platform.width / 2,
            platform.y + 5,
            platform.width,
            10,
        );
    });
}
