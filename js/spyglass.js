/*jshint esversion: 8 */
/*global domReady  */

window.app = {};

let muteButtons, soundOnOffButton, container, animationFrameImg,
  zoomMinus, zoomPlus, artifactImage;

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

let soundOnOff = 'off';
let soundIsOn = () => soundOnOff == 'on';

let startPlayDelay = 500;

let audioCollection = [];
document.querySelectorAll('audio').forEach((audioPlayer) => {
  let container = audioPlayer.parentElement;
  let computedStyle = getComputedStyle(container);
  let visibility = computedStyle.visibility;
  audioCollection.push({
    audioPlayer: audioPlayer,
    container: container,
    computedStyle: computedStyle,
    visibility: visibility,
    played: false,
    startPlayTimeoutID: null
  })
})

let updateAudioCollection = (muteStateChanged = false) => {
  let visibilityChanged = (item) => {
    return item.computedStyle.visibility !== item.visibility;
  }
  let isVisible = (item) => {
    return item.visibility == 'visible';
  }
  let isNotVisible = (item) => {
    return !isVisible(item);
  }
  let stop = (item) => {
    console.log('stop');
    item.audioPlayer.pause();
    item.audioPlayer.currentTime = 0;
    window.clearTimeout(item.startPlayTimeoutID);
  }
  let play = (item) => {
    console.log('play');
    item.startPlayTimeoutID = setTimeout(() => {
      item.audioPlayer.play();
      item.played = true;
    }, startPlayDelay);
  }
  let updateAudio = (item) => {
    if (isVisible(item)) {
      if (soundOnOff == 'on') {
        if (item.audioPlayer.paused && !item.played) {
          item.audioPlayer.currentTime = 0;
          console.log('start playing:', item.audioPlayer.id);
          play(item);
        }
      } else {
        console.log('visible but stop playing:', item.audioPlayer.id);
        stop(item);
      }
    } else {
      console.log('not visible, stop playing:', item.audioPlayer.id);
      stop(item);
    }
  }
  audioCollection.forEach((item) => {
    if (visibilityChanged(item)) {
      console.log('visibility changed from:', item.visibility, 'to:', item.computedStyle.visibility);
      item.visibility = item.computedStyle.visibility;
      if (isNotVisible(item)) item.played = false;
    }
    if (muteStateChanged) item.played = false;
  })
  audioCollection.forEach((item) => updateAudio(item));
}

let processSoundControls = () => {
  let currentState = soundOnOffButton.dataset.sound;
  let updateSoundControl = (el) => {
    let onChildren = el.querySelectorAll('*.on');
    let offChildren = el.querySelectorAll('*.off');
    if (currentState == 'off') {
      soundOnOff = 'on';
      soundOnOffButton.dataset.sound = soundOnOff;
      onChildren.forEach((el) => {
        el.style.display = 'block';
      })
      offChildren.forEach((el) => {
        el.style.display = 'none';
      })
    } else if (currentState == 'on') {
      soundOnOff = 'off';
      soundOnOffButton.dataset.sound = soundOnOff;
      onChildren.forEach((el) => {
        el.style.display = 'none';
      })
      offChildren.forEach((el) => {
        el.style.display = 'block';
      })
    }
    console.log('sound:', soundOnOff);
  }
  updateSoundControl(soundOnOffButton);
  muteButtons.forEach((muteButton) => updateSoundControl(muteButton));
  updateAudioCollection(true);
}

const startup = () => {

  container = document.getElementById('spyglass');
  animationFrameImg = document.getElementById('animation-frame');

  // Listen for new scroll events, here we debounce our `storeScroll` function
  document.addEventListener('scroll', debounce(storeScroll), { passive: true });

  // Update scroll position for first time
  storeScroll();

  zoomMinus = document.getElementById('zoom-minus');
  zoomPlus = document.getElementById('zoom-plus');
  artifactImage = document.getElementById('artifact-image');

  zoomMinus.addEventListener('click', () => {
    artifactImageScale /= artifactZoomIncrement;
    manageZoomButtons();
  })

  zoomPlus.addEventListener('click', () => {
    artifactImageScale *= artifactZoomIncrement;
    manageZoomButtons();
  })

  soundOnOffButton = document.getElementById('sound-on-off');

  soundOnOffButton.addEventListener('click', (e) => {
    console.log('sound-on-off clicked');
    let unmuteFooter = e.target.parentElement;
    processSoundControls();
    if (soundIsOn()) {
      unmuteFooter.classList.add('on');
    } else {
      unmuteFooter.classList.remove('on');
    }
  });

  muteButtons = document.querySelectorAll('.mute-button.secondary');

  muteButtons.forEach((muteButton) => {
    muteButton.addEventListener('click', () => processSoundControls(muteButton));
  })

  document.addEventListener('scroll', debounce(updateAudioCollection), { passive: true });

}

domReady(startup);
