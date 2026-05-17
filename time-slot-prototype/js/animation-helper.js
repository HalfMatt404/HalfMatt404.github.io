export function getLeftRightFrames(folder, frameCount) {
    const leftFrames = getAnimationFrames(`${folder}Left`, frameCount);
    const rightFrames = getAnimationFrames(`${folder}Right`, frameCount);
    const maxFrame = Math.min(leftFrames.length, rightFrames.length);
    const zippedList = [];

    for (let i = 0; i < maxFrame; i++) {
        zippedList.push({
            left: leftFrames[i],
            right: rightFrames[i],
        });
    }

    return zippedList;
}

export function getAnimationFrames(folder, frameCount) {
    let returnFrames = [];

    for (let i = 0; i < frameCount; i++) {
        let newImage = new Image();
        newImage.src = `animations/${folder}/${i}.png`;
        returnFrames.push(newImage);
    }

    return returnFrames;
}
