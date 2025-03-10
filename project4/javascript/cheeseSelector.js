"use strict";
const imgDir = "images/";
const images = ["smokedSwiss.png", "galaxyCheese.png", "watcherCheese.png", "sharpCheddar.png", "programolone.png"];
let itemsInCart = 0;
let imageOffset = 0;
let carouselImages;
let center;
let updateImages = () => {
    for (let i = 0; i < carouselImages.length; i++) {
        if (getPositionIndex(i) == center - 1) {
            carouselImages[i].classList.toggle("active");
        }
    }
    for (let i = 0; i < carouselImages.length; i++) {
        const spaceBetween = (getElement(".carousel").getBoundingClientRect().width) / carouselImages.length;
        const newPosition = ((spaceBetween * getPositionIndex(i)) - 50) + 'px';
        carouselImages[i].style.left = newPosition;
    }
    for (let i = 0; i < carouselImages.length; i++) {
        let imageSlot = (((getPositionIndex(i) + imageOffset) % images.length) + images.length) % images.length;
        carouselImages[i].src = imgDir + images[imageSlot];
    }
    for (let i = 0; i < carouselImages.length; i++) {
        if (getPositionIndex(i) == center - 1) {
            let cheeseName = carouselImages[i].src.match(/\w+(?=\.)/).toString();
            cheeseName = cheeseName.replace(/([A-Z])/g, ' $1');
            cheeseName = cheeseName[0].toUpperCase() + cheeseName.substring(1, Infinity);
            $("#cheeseLabel").text(cheeseName);
        }
    }
};
function slideImages(offset) {
    for (let image of carouselImages) {
        if (image.classList.contains("active")) {
            image.classList.toggle("active");
        }
    }
    imageOffset += offset;
    updateImages();
}
document.addEventListener("DOMContentLoaded", () => {
    carouselImages = Array.from(getElement(".carousel").children);
    for (let i = 0; i < carouselImages.length; i++) {
        carouselImages[i].style.setProperty('--carouselIndex', i.toString());
    }
    center = Math.round(carouselImages.length / 2);
    updateImages();
    for (let i = 0; i < carouselImages.length; i++) {
        carouselImages[i].addEventListener('click', () => {
            const distanceFromCenter = getPositionIndex(i) + 1 - center;
            slideImages(distanceFromCenter);
        });
    }
    getElement("#addToCart").addEventListener('click', () => {
        itemsInCart++;
        let newCheeseImage = document.createElement('img');
        let newLiElement = document.createElement('li');
        for (let i = 0; i < carouselImages.length; i++) {
            if (getPositionIndex(i) + 1 == center) {
                newCheeseImage.src = carouselImages[i].src;
            }
        }
        newLiElement.appendChild(newCheeseImage);
        getElement("#cart").appendChild(newLiElement);
        getElement("#buy").style.display = "block";
    });
    getElement("#buy").addEventListener('click', () => {
        const cart = getElement("#cart").children;
        const initialChildLength = cart.length;
        for (let i = initialChildLength - 1; i > 0; i--) {
            cart[i].remove();
        }
        if (itemsInCart > 0) {
            alert("Cheese is being sent to your house");
            itemsInCart = 0;
            getElement("#buy").style.display = "none";
        }
    });
    getElement("#buy").style.display = "none";
});
function getPositionIndex(index) {
    const imageAmount = carouselImages.length;
    const positionIndex = (((parseInt(carouselImages[index].style.getPropertyValue('--carouselIndex')) - imageOffset) % imageAmount) + imageAmount) % imageAmount;
    return positionIndex;
}
