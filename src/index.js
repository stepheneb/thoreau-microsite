/*jshint esversion: 8 */

const domReady = (callBack) => {
  if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', callBack);
  } else {
    callBack();
  }
}

let selectRight = document.getElementById('select-right');
let selectLeft = document.getElementById('select-left');
let selectedImage = document.getElementById('selected-image');

let carouselImageContainer = document.getElementById('carousel-image-container');

let pages = [{
    id: 'snowshoes',
    location: "snowshoes.html",
    enabled: false,
    src: "images/thoreau-snowshoes-close.png"
  },
  {
    id: 'spyglass',
    location: "spyglass.html",
    enabled: true,
    src: "images/spyglass.png"
  },
  {
    id: 'lock-and-key',
    location: "lock-and-key.html",
    enabled: false,
    src: "images/lock-and-key.png"
  },
  {
    id: 'desk',
    location: "desk.html",
    enabled: false,
    src: "images/desk.png",
  },
  {
    id: 'flute',
    location: "flute.html",
    enabled: false,
    src: "images/flutes.png"
  },
  {
    id: 'walking-stick',
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
  window.location.hash = selectedPage.id;
}

let nextPage = () => {
  pageIndex += 1;
  if (pageIndex >= pages.length) pageIndex = 0;
  selectedPage = pages[pageIndex];
  updateSelectedPage();
}

let previousPage = () => {
  pageIndex -= 1;
  if (pageIndex < 0) pageIndex = pages.length - 1;
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

domReady(() => {
  let hash = window.location.hash.slice(1);
  let index;
  // let changed = false;
  if (hash.length > 0) {
    index = pages.findIndex((p) => p.id == hash);
    if (index >= 0) {
      // if (pageIndex !== index) changed = true;
      pageIndex = index;
    }
  }
  selectedPage = pages[pageIndex];
  updateSelectedPage();
});
