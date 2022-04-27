/*jshint esversion: 8 */
/*global */

import { app } from "./modules/globals.js";
import { pages } from "./modules/pages.js";
import { generateFooterItems, generateDropdownUL } from "./modules/menu.js";

app.dev = true;

const artifactPages = pages.filter(p => p.type == 'artifact' && p.enabled);

let selectRight, selectLeft, selectedImage, carouselImageContainer, carouselImage;

let pageIndex = 1;
let selectedPage = artifactPages[pageIndex];
let swipeCompleted = false;

let updateSelectedPage = () => {
  selectedImage.classList.remove('selected');
  selectedPage = artifactPages[pageIndex];
  selectedImage = selectedPage.element;
  selectedImage.classList.add('selected');
  window.location.hash = selectedPage.id;
}

let nextPage = () => {
  pageIndex += 1;
  if (pageIndex >= artifactPages.length) pageIndex = 0;
  selectedPage = artifactPages[pageIndex];
  updateSelectedPage();
}

let previousPage = () => {
  pageIndex -= 1;
  if (pageIndex < 0) pageIndex = artifactPages.length - 1;
  selectedPage = artifactPages[pageIndex];
  updateSelectedPage();
}

let generateCarouselImgElements = () => {
  artifactPages.forEach((page, index) => {
    let img = document.createElement("img");
    img.classList.add(page.id);
    img.src = page.src;
    if (page.enabled) img.classList.add('enabled');
    if (index == pageIndex) {
      img.classList.add('selected');
      selectedImage = img;
    }
    carouselImageContainer.append(img);
    page.element = img;
  })
};

app.domReady(() => {
  generateDropdownUL('main');

  const dropdown = document.getElementById('explore-another-object');
  const pinetree = document.getElementById('mobile-pinetree');

  dropdown.addEventListener('show.bs.dropdown', () => {
    pinetree.classList.add('hide');
  })
  dropdown.addEventListener('hide.bs.dropdown', () => {
    pinetree.classList.remove('hide');
  })
  generateFooterItems();
  selectRight = document.getElementById('select-right');
  selectLeft = document.getElementById('select-left');
  carouselImageContainer = document.getElementById('carousel-image-container');

  let hash = window.location.hash.slice(1);
  let index;
  if (hash.length > 0) {
    index = artifactPages.findIndex((p) => p.id == hash);
    if (index >= 0) {
      pageIndex = index;
    }
  }
  generateCarouselImgElements();
  selectedPage = artifactPages[pageIndex];

  // loadCarouselImages();

  selectRight.addEventListener('click', () => {
    nextPage();
  })

  selectLeft.addEventListener('click', () => {
    previousPage();
  })

  // carouselImageContainer.addEventListener('click', () => {
  //   if (selectedPage.enabled) {
  //     location = selectedPage.location;
  //   }
  // })

  let swipeDragStarted = false;
  let currentSwipeDistance = 0;

  const carouselPointerDown = (e) => {
    swipeDragStarted = e.offsetX;
    swipeCompleted = false;
    e.preventDefault();
    app.logger('carouselPointerDown', e, 'swipeDragStarted', swipeDragStarted);
  }

  const swipeIsActive = () => {
    let active = swipeDragStarted && Math.abs(currentSwipeDistance) > 10;
    return active;
  }

  const swipeIsNotActive = () => {
    return !swipeIsActive() && !swipeCompleted;
  }

  const swipeIsComplete = () => {
    let completion = carouselImageContainer.clientWidth / 5;
    swipeCompleted = swipeDragStarted && Math.abs(currentSwipeDistance) > completion;
    if (swipeCompleted) {
      swipeEnd();
    }
    return swipeCompleted;
  };

  const swipeEnd = () => {
    swipeDragStarted = false;
    currentSwipeDistance = 0;
    carouselImageContainer.style.marginLeft = '';
    carouselImageContainer.style.marginRight = '';
  }

  const carouselPointerMove = (e) => {
    if (swipeDragStarted) {
      e.preventDefault();
      app.logger('carouselPointerMove', e, 'swipeDragStarted', swipeDragStarted);
      currentSwipeDistance = (e.offsetX - swipeDragStarted);
      let shift = `${Math.abs(currentSwipeDistance)}px`;
      console.log(shift);
      if (swipeIsActive()) {
        app.logger('swipeIsActive', swipeIsActive());
        e.preventDefault();
        e.stopPropagation();
        if (currentSwipeDistance > 10) {
          carouselImageContainer.style.marginLeft = '';
          carouselImageContainer.style.marginRight = `-${currentSwipeDistance}px`;
          if (swipeIsComplete()) {
            nextPage();
          }
        } else if (currentSwipeDistance < -10) {
          carouselImageContainer.style.marginRight = '';
          carouselImageContainer.style.marginLeft = `${currentSwipeDistance}px`;
          if (swipeIsComplete()) {
            previousPage();
          }
        }
      }
    }
  }

  const carouselPointerEnd = (e) => {
    if (swipeIsNotActive() && e.type == 'pointerup') {
      e.preventDefault();
      e.stopPropagation();
      swipeEnd();
      location = selectedPage.location;
    }
    swipeEnd();
  }

  const carouselSwipeStartEvents = [
    'pointerdown'
  ]

  const carouselSwipeMoveEvents = [
    'pointermove'
  ]

  const carouselSwipeEndEvents = [
    'pointerup',
    'pointerout',
    'pointerleave'
  ]

  carouselSwipeStartEvents.forEach((event) => {
    carouselImageContainer.addEventListener(event, carouselPointerDown);
  })

  carouselSwipeMoveEvents.forEach((event) => {
    carouselImageContainer.addEventListener(event, carouselPointerMove);
  })

  carouselSwipeEndEvents.forEach((event) => {
    carouselImageContainer.addEventListener(event, carouselPointerEnd);
  })

  updateSelectedPage();
});
