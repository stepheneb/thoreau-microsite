/*jshint esversion: 8 */
/*global app pages */

let selectRight, selectLeft, selectedImage, carouselImageContainer;

let pageIndex = 1;
let selectedPage = pages[pageIndex];

let updateSelectedPage = () => {
  selectedImage.classList.remove('selected');
  selectedPage = pages[pageIndex];
  selectedImage = selectedPage.element;
  selectedImage.classList.add('selected');
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

let generateCarouselImgElements = () => {
  pages.forEach((page, index) => {
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
  selectRight = document.getElementById('select-right');
  selectLeft = document.getElementById('select-left');
  carouselImageContainer = document.getElementById('carousel-image-container');

  let hash = window.location.hash.slice(1);
  let index;
  if (hash.length > 0) {
    index = pages.findIndex((p) => p.id == hash);
    if (index >= 0) {
      pageIndex = index;
    }
  }
  generateCarouselImgElements();
  selectedPage = pages[pageIndex];

  // loadCarouselImages();

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
});
