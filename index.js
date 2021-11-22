/*jshint esversion: 8 */

let selectRight = document.getElementById('select-right');
let selectLeft = document.getElementById('select-left');
let selectedImage = document.getElementById('selected-image');

let carouselImageContainer = document.getElementById('carousel-image-container');

let pages = [{
    location: "snowshoes.html",
    enabled: false,
    src: "images/thoreau-snowshoes-close.png"
  },
  {
    location: "spyglass.html",
    enabled: true,
    src: "images/spyglass.png"
  },
  {
    location: "lock-and-key.html",
    enabled: false,
    src: "images/lock-and-key.png"
  },
  {
    location: "desk.html",
    enabled: false,
    src: "images/desk.png"
  },
  {
    location: "flute.html",
    enabled: false,
    src: "images/flutes.png"
  },
  {
    location: "walking-stick.html",
    enabled: false,
    src: "images/walking-stick.png"
  }
]

let pageIndex = 0;
let selectedPage = pages[pageIndex];

let updateSelectedPage = () => {
  if (selectedPage.enabled) {
    selectedImage.classList.add('enabled');
  } else {
    selectedImage.classList.remove('enabled');
  }
  selectedImage.src = selectedPage.src;
}

let nextPage = () => {
  pageIndex += 1;
  if (pageIndex >= pages.length) pageIndex = 0;
  selectedPage = pages[pageIndex];
  updateSelectedPage();
}

let previousPage = () => {
  pageIndex -= 1;
  if (pageIndex > 0) pageIndex = pages.length - 1;
  selectedPage = pages[pageIndex];
  updateSelectedPage();
}

selectRight.addEventListener('click', () => {
  nextPage();
})

selectLeft.addEventListener('click', () => {
  previousPage();
})

carouselImageContainer.addEventListener('click', () => {
  if (selectedPage.enabled) {
    location = selectedPage.location;
  }
})

updateSelectedPage();
