/*jshint esversion: 8 */

let selectRight = document.getElementById('select-right');
let selectLeft = document.getElementById('select-left');
let selectedImage = document.getElementById('selected-image');

let images = [
  "images/thoreau-snowshoes-close.png",
  "images/spyglass.png",
  "images/lock-and-key.png",
  "images/desk.png",
  "images/flutes.png",
  "images/walking-stick.png"
]

let index = 0;

let nextImage = () => {
  index += 1;
  if (index >= images.length) index = 0;
}

let previousImage = () => {
  index -= 1;
  if (index > 0) index = images.length - 1;
}

selectRight.addEventListener('click', () => {
  nextImage();
  selectedImage.src = images[index];
})

selectLeft.addEventListener('click', () => {
  previousImage();
  selectedImage.src = images[index];
})
