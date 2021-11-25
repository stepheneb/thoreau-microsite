/*jshint esversion: 8 */
/*global  app */

// app.dev = true;

let muteButtons, unmuteFooter, soundOnOffButton, container, animationFrameImg,
  zoomMinus, zoomPlus, artifactImage, afCallback, aCount, storeScrollArguments;

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
      fn(...params, ...storeScrollArguments);
    });

  };
};

// Reads out the scroll position and stores it in the data attribute
// so we can use it in our stylesheets
const storeScroll = (callback, animationFrameImg, animationCount) => {
  let totalHeight = container.clientHeight;
  let startAnimation = window.innerHeight * 1;
  let scrollHeight = totalHeight - window.innerHeight * 4;
  // let animationCount = 243;
  let animationStepHeight = scrollHeight / animationCount;
  let animationFrameNum = 0;
  if (window.scrollY > startAnimation) {
    animationFrameNum = Math.max(0, Math.min(animationCount, Math.floor((window.scrollY - startAnimation) / animationStepHeight)));
  }
  container.dataset.animationscroll = animationFrameNum;
  container.dataset.contentscroll = Math.floor(window.scrollY / window.innerHeight + 0.60);
  if (callback) {
    callback(animationFrameNum, animationFrameImg);
  }
};

const storeScrollListener = (e, ...args) => {
  storeScroll(...args);
}

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
// let soundIsOff = () => !soundIsOn();

let startPlayDelay = 500;

let audioCollection = [];
document.querySelectorAll('audio').forEach((audioPlayer) => {
  let container = audioPlayer.parentElement;
  let id = audioPlayer.parentElement.parentElement.id;
  let computedStyle = getComputedStyle(container);
  let visibility = computedStyle.visibility;
  let opacity = computedStyle.opacity;
  audioCollection.push({
    id: id,
    audioPlayer: audioPlayer,
    container: container,
    computedStyle: computedStyle,
    visibility: visibility,
    opacity: opacity,
    played: false,
    startPlayTimeoutID: null
  })
})

let updateAudioCollection = (muteStateChanged = false) => {
  let visibilityChanged = (item) => {
    item.computedStyle = getComputedStyle(item.container);
    return item.computedStyle.visibility !== item.visibility || item.computedStyle.opacity !== item.opacity;
  }
  let isVisible = (item) => {
    return item.visibility == 'visible' && item.opacity == 1.0;
  }
  let isNotVisible = (item) => {
    return !isVisible(item);
  }
  let stop = (item) => {
    app.logger('stop', item.audioPlayer.id);
    item.audioPlayer.pause();
    item.audioPlayer.currentTime = 0;
    window.clearTimeout(item.startPlayTimeoutID);
  }
  let stopAll = () => {
    audioCollection.forEach((item) => stop(item));
  }
  let play = (item) => {
    stopAll();
    app.logger('play', item.audioPlayer.id);
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
          // app.logger('start playing:', item.audioPlayer.id);
          play(item);
        }
      } else {
        // app.logger('visible but stop playing:', item.audioPlayer.id);
        stop(item);
      }
    } else {
      // app.logger('not visible, stop playing:', item.audioPlayer.id);
      stop(item);
    }
  }
  app.logger('.');
  audioCollection.forEach((item) => {
    if (visibilityChanged(item)) {
      app.logger(item.id, '=========>', item.computedStyle.visibility);
      item.visibility = item.computedStyle.visibility;
      if (isNotVisible(item)) item.played = false;
    } else {
      app.logger(item.id, ':', item.computedStyle.visibility);
    }
    if (muteStateChanged) item.played = false;
  })
  if (soundIsOn() || muteStateChanged) {
    audioCollection.forEach((item) => updateAudio(item));
  }
}

let updateAudioCollectionListener = () => { updateAudioCollection() };

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
    app.logger('sound:', soundOnOff);
  }
  updateSoundControl(soundOnOffButton);
  if (soundIsOn()) {
    unmuteFooter.classList.add('on');
  } else {
    unmuteFooter.classList.remove('on');
  }
  muteButtons.forEach((muteButton) => updateSoundControl(muteButton));
  updateAudioCollection(true);
}

// eslint-disable-next-line no-unused-vars
const startup = (id, callback, count) => {
  container = document.getElementById(id);
  afCallback = callback;
  animationFrameImg = document.getElementById('animation-frame');
  aCount = count;

  storeScrollArguments = [afCallback, animationFrameImg, aCount];
  document.addEventListener('scroll',
    debounce(storeScrollListener), { passive: true });

  // Update scroll position for first time
  storeScroll(afCallback, animationFrameImg, aCount);

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
  unmuteFooter = document.getElementById('unmute-footer');

  if (soundOnOffButton) {
    soundOnOffButton.addEventListener('click', () => {
      app.logger('sound-on-off clicked');
      processSoundControls();
    });
    muteButtons = document.querySelectorAll('.mute-button.secondary');

    muteButtons.forEach((muteButton) => {
      muteButton.addEventListener('click', () => processSoundControls(muteButton));
    })
    document.addEventListener('scroll', debounce(updateAudioCollectionListener), { passive: true });
  }

}
