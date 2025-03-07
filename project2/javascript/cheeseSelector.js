"use strict" 

const imgDir = "images/"
const images = ["random_particles.png", "rock.png", "scales.png", "scribbles.png", "smoke.png", "sparkle.png", "square_rough.png"];

let itemsInCart = 0;

let imageOffset = 0;
let carouselImages;



let updateImages = () => {

  for (let i = 0; i < carouselImages.length; i++) {
    
    let imageSlot = (((i + imageOffset) % images.length) + images.length) % images.length;

    carouselImages[i].src = imgDir + images[imageSlot];
  }
}



document.addEventListener("DOMContentLoaded", () => {

  carouselImages = getElement(".carousel").children;

  updateImages();

  carouselImages[0].addEventListener('click', () => {
    imageOffset -= 1;
    updateImages();
  }) 

  carouselImages[2].addEventListener('click', () => {

    imageOffset += 1;
    updateImages();
  }) 

  // Cheese selector
  getElement("#addToCart").addEventListener('click', () => {

    itemsInCart++;
    
    // Prepares and appends an element to the shopping cart
    let newCheeseImage = document.createElement('img');
    let newLiElement = document.createElement('li');

    // Index 1 is the "Active" image
    newCheeseImage.src = carouselImages[1].src;

    newLiElement.appendChild(newCheeseImage);

    getElement("#cart").appendChild(newLiElement);

    getElement("#buy").style.display = "block";
  });
  

  // Shopping cart buy button
  getElement("#buy").addEventListener('click', () => {
    const cart = getElement("#cart").children;

    const initialChildLength = cart.length;
    // We don't want to delete the buy button so we never remove index 0
    for (let i = initialChildLength - 1; i > 0; i--) 
    {
        cart[i].remove();
    }

    if (itemsInCart > 0) {

      alert("Cheese is being sent to your house");
      
      itemsInCart = 0;
      getElement("#buy").style.display = "none";
    }

  })

  // initial hiding of the buy button
  getElement("#buy").style.display = "none";

})