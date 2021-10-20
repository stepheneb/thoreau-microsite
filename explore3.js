/*jshint esversion: 8 */

window.app = {};

// The debounce function receives our function as a parameter
const debounce = (fn) => {

  // This holds the requestAnimationFrame reference, so we can cancel it if we wish
  let frame;

  // The debounce function returns a new function that can receive a variable number of arguments
  return (...params) => {

    // If the frame variable has been defined, clear it now, and queue for next frame
    if (frame) {
      cancelAnimationFrame(frame);
    }

    // Queue our function call for the next frame
    frame = requestAnimationFrame(() => {

      // Call our function and pass any params we received
      fn(...params);
    });

  };
};

let container = document.getElementById('explore3');
let animationFrameImg = document.getElementById('animation-frame');

// Reads out the scroll position and stores it in the data attribute
// so we can use it in our stylesheets
const storeScroll = () => {
  let totalHeight = container.clientHeight;
  let startAnimation = window.innerHeight * 1;
  let scrollHeight = totalHeight - window.innerHeight * 4;
  let animationCount = 243;
  let animationStepHeight = scrollHeight / animationCount;
  let animationFrameNum = 0;
  if (window.scrollY > startAnimation) {
    animationFrameNum = Math.max(0, Math.min(animationCount, Math.floor((window.scrollY - startAnimation) / animationStepHeight)));
  }
  container.dataset.animationscroll = animationFrameNum;
  container.dataset.contentscroll = Math.floor(window.scrollY / window.innerHeight + 0.60);

  let paddedFrameNum = (animationFrameNum).toString().padStart(5, '0');
  let newSrc = `images/animations/spyglass/Spyglass_PNGSeq_01__${paddedFrameNum}.png`;
  if (animationFrameImg.src !== newSrc) {
    animationFrameImg.src = newSrc;
  }
};

// Listen for new scroll events, here we debounce our `storeScroll` function
document.addEventListener('scroll', debounce(storeScroll), { passive: true });

// Update scroll position for first time
storeScroll();
