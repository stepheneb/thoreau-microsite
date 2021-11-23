/*jshint esversion: 8 */

// const domReady = (callBack) => {
//   if (document.readyState === "loading") {
//     document.addEventListener('DOMContentLoaded', callBack);
//   }
//   else {
//     callBack();
//   }
// }

const windowReady = (callBack) => {
  if (document.readyState === 'complete') {
    callBack();
  } else {
    window.addEventListener('load', callBack);
  }
}

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

let container = document.getElementById('spyglass');
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

let zoomMinus = document.getElementById('zoom-minus');
let zoomPlus = document.getElementById('zoom-plus');
let artifactImage = document.getElementById('artifact-image');
let artifactImageScale = 1;
let artifactMaxImageScale = 3;
let artifactZoomIncrement = 1.1;

let rescaleArtifactImage = () => {
  artifactImage.style.transform = `scale(${artifactImageScale})`;
}

let manageZoomButtons = () => {
  if (artifactImageScale > artifactMaxImageScale) {
    artifactImageScale = artifactMaxImageScale;
    zoomPlus.setAttribute("disabled", "disabled");
  } else {
    zoomPlus.removeAttribute("disabled");
  }
  if (artifactImageScale < 1) {
    artifactImageScale = 1;
    zoomMinus.setAttribute("disabled", "disabled");
  } else {
    zoomMinus.removeAttribute("disabled");
  }
  rescaleArtifactImage();
}

zoomMinus.addEventListener('click', () => {
  artifactImageScale /= artifactZoomIncrement;
  manageZoomButtons();
})

zoomPlus.addEventListener('click', () => {
  artifactImageScale *= artifactZoomIncrement;
  manageZoomButtons();
})

let soundOnOff = 'off';
let soundOnOffButton = document.getElementById('sound-on-off');

let audioCollection = [];
document.querySelectorAll('audio').forEach((audioPlayer) => {
  let container = audioPlayer.parentElement;
  let computedStyle = getComputedStyle(container);
  let visibility = computedStyle.visibility;
  audioCollection.push({
    audioPlayer: audioPlayer,
    container: container,
    computedStyle: computedStyle,
    visibility: visibility
  })
})

soundOnOffButton.addEventListener('click', () => {
  let onChildren = soundOnOffButton.querySelectorAll('*.on');
  let offChildren = soundOnOffButton.querySelectorAll('*.off');
  let currentState = soundOnOffButton.dataset.sound;
  if (currentState == 'off') {
    soundOnOff = 'on';
    soundOnOffButton.dataset.sound = soundOnOff;
    onChildren.forEach((el) => {
      el.style.display = 'block';
    })
    // audioCollection.forEach((item) => {
    //   item.audioPlayer.style.display = 'block';
    // })
    offChildren.forEach((el) => {
      el.style.display = 'none';
    })
  } else if (currentState == 'on') {
    soundOnOff = 'off';
    soundOnOffButton.dataset.sound = soundOnOff;
    onChildren.forEach((el) => {
      el.style.display = 'none';
    })
    audioCollection.forEach((item) => {
      item.audioPlayer.style.display = 'none';
    })
    offChildren.forEach((el) => {
      el.style.display = 'block';
    })
  }
});

const startup = () => {

  let start, previousTimeStamp;

  function step(timestamp) {
    if (start === undefined)
      start = timestamp;

    if (previousTimeStamp !== timestamp) {
      audioCollection.forEach((item) => {
        if (item.computedStyle.visibility !== item.visibility) {
          console.log('visibility changed from:', item.visibility, 'to:', item.computedStyle.visibility);
          item.visibility = item.computedStyle.visibility;
          if (item.visibility == 'visible') {
            if (soundOnOff == 'on') {
              if (item.audioPlayer.paused) item.audioPlayer.play();
            }
          } else {
            item.audioPlayer.pause();
            item.audioPlayer.currentTime = 0
          }
        }
      })
    }
    previousTimeStamp = timestamp
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
}

windowReady(startup);
