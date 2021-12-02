/*jshint esversion: 8 */
/*global  app */

app.firstUserSoundOnRequest = true;

let muteButtons, unmuteFooter, soundOnOffButton, container, animationFrameImg,
  zoomMinus, zoomPlus, artifactImage, audioElement, storeScrollArguments;

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

const storeScroll = (animations, animationFrameImg) => {
  const contentViewportOffset = 0.4;
  let contentScrollFLoat = window.scrollY / window.innerHeight + contentViewportOffset;
  let contentScroll = Math.floor(contentScrollFLoat);
  let result, animation;

  let inScope = (animations) => {
    let result = {
      animation: false,
      frameNum: 0,
      visible: false
    }

    let calcFrameNum = (a) => {
      let extent = a.endScroll - a.startScroll;
      let stepHeight = extent / (a.endFrame - a.startFrame);
      let currentScrollHeight = contentScrollFLoat - a.startScroll;
      return Math.round(currentScrollHeight / stepHeight) + a.startFrame;
    }

    let inPageScopeBefore = (a) => {
      return contentScroll >= a.startPage && contentScrollFLoat < a.startScroll;
    }

    let inScrollScope = (a) => {
      return contentScrollFLoat >= a.startScroll && contentScrollFLoat < a.endScroll;
    }

    let inPageScopeAfter = (a) => {
      return contentScrollFLoat >= a.endScroll && contentScroll <= a.endPage;
    }

    if (animations !== undefined) {
      animations.forEach((a) => {
        if (inPageScopeBefore(a)) {
          result = {
            animation: a,
            frameNum: 0,
            visible: false
          }
        } else if (inScrollScope(a)) {
          result = {
            animation: a,
            frameNum: calcFrameNum(a),
            visible: true
          }
        } else if (inPageScopeAfter(a)) {
          result = {
            animation: a,
            frameNum: a.endFrame,
            visible: true
          }
        }
      })
    }
    return result;
  }

  result = inScope(animations);
  animation = result.animation;
  if (animation) {
    animation.callback(result.frameNum, animationFrameImg, result.visible);
  }
  contentScrollFLoat = Math.min(app.maxContentScroll, contentScrollFLoat);
  container.dataset.contentScrollFloat = contentScrollFLoat;
  container.dataset.contentScroll = contentScroll;
  container.dataset.scrollY = window.scrollY;
  container.dataset.innerHeight = window.innerHeight;
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

let isVideo = (mediaPlayer) => {
  let proto = Object.prototype.toString.call(mediaPlayer).slice(8, -1).toLowerCase();
  return proto == 'htmlvideoelement';
}
let isAudio = (mediaPlayer) => {
  let proto = Object.prototype.toString.call(mediaPlayer).slice(8, -1).toLowerCase();
  return proto == 'htmlaudioelement';
}

let mediaCollection = [];
document.querySelectorAll('audio, video').forEach((mediaPlayer) => {
  let container = mediaPlayer.parentElement;
  if (isVideo(mediaPlayer)) {
    container = container.parentElement;
  }
  let id = mediaPlayer.parentElement.parentElement.id;
  let computedStyle = getComputedStyle(container);
  let visibility = computedStyle.visibility;
  let opacity = computedStyle.opacity;
  mediaCollection.push({
    id: id,
    mediaPlayer: mediaPlayer,
    container: container,
    computedStyle: computedStyle,
    visibility: visibility,
    opacity: opacity,
    played: false,
    startPlayTimeoutID: null
  })
})

let updatemediaCollection = (muteStateChanged = false) => {
  let contentFloatScroll = document.body.dataset.contentScrollFloat;
  if (contentFloatScroll) {
    contentFloatScroll = +contentFloatScroll;
  }
  let isVideoItem = (item) => {
    return isVideo(item.mediaPlayer);
  }
  let isAudioItem = (item) => {
    return isAudio(item.mediaPlayer);
  }
  let isVisible = (item) => {
    return item.visibility == 'visible';
  }
  let isNotVisible = (item) => {
    return item.visibility == 'hidden' || item.opacity < 1;
  }
  let paused = (item) => {
    let p = item.mediaPlayer.paused || audioElement.paused;
    app.logger('paused', item.mediaPlayer.id, p);
    return p;
  }
  // let reset = (item) => {
  //   app.logger('reset', item.mediaPlayer.id);
  //   item.mediaPlayer.currentTime = 0;
  //   audioElement.currentTime = 0;
  // }
  let visibilityChanged = (item) => {
    item.computedStyle = getComputedStyle(item.container);
    let changed = false;
    changed = item.computedStyle.visibility !== item.visibility || item.computedStyle.opacity !== item.opacity;
    return changed;
  }
  let stopAudio = (item) => {
    app.logger('stopAudio', item.mediaPlayer.id);
    if (isAudioItem(item)) {
      item.mediaPlayer.currentTime = 0;
      if (item.mediaPlayer.src == audioElement.src) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      window.clearTimeout(item.startPlayTimeoutID);
    } else if (isVideoItem(item)) {
      item.mediaPlayer.setAttribute('muted', 'muted')
      item.mediaPlayer.muted = true;
      window.clearTimeout(item.startPlayTimeoutID);
    } else {
      console.error('unknow media type:', item.mediaPlayer);
    }
  }
  // let stopAll = () => {
  //   mediaCollection.forEach((item) => stopAudio(item));
  // }
  let stopOthers = (item) => {
    mediaCollection.forEach((i) => {
      if (i.id !== item.id) {
        stopAudio(i);
      }
    })
  }
  let play = (item) => {
    app.logger('play', item.mediaPlayer.id);
    if (isAudioItem(item)) {
      stopOthers(item);
      item.startPlayTimeoutID = setTimeout(() => {
        audioElement.src = item.mediaPlayer.src;
        audioElement.play();
        audioElement.volume = 1;
        // item.mediaPlayer.play();
      }, startPlayDelay);
    } else if (isVideoItem(item)) {
      item.startPlayTimeoutID = setTimeout(() => {
        item.mediaPlayer.play();
      }, startPlayDelay);
    }
    item.played = true;
  }
  let updateMedia = (item) => {
    if (isVisible(item)) {
      if (soundOnOff == 'on') {
        if (isAudioItem(item) && paused(item) && !item.played) {
          // reset(item);
          play(item);
        } else if (isVideoItem(item)) {
          item.mediaPlayer.removeAttribute("muted");
          item.mediaPlayer.muted = false;
          play(item);
        }

      } else {
        stopAudio(item);
      }
    } else {
      app.logger('not visible, stop playing:', item.mediaPlayer.id);
      stopAudio(item);
    }
  }
  mediaCollection.forEach((item) => {
    if (visibilityChanged(item)) {
      app.logger(item.id, '=========>', item.computedStyle.visibility);
      item.visibility = item.computedStyle.visibility;
      if (isNotVisible(item)) item.played = false;
      if (isVideoItem(item)) {
        if (isVisible(item)) {
          play(item);
        } else {
          stopAudio(item);
        }
      }
    } else {
      app.logger(item.id, ':', item.computedStyle.visibility);
    }
    if (muteStateChanged) item.played = false;
    if (isAudioItem(item)) {
      if (item.fadeOutStart) {
        if (item.fadeOutStart <= contentFloatScroll && item.fadeOutEnd > contentFloatScroll) {
          let extent = item.fadeOutEnd - item.fadeOutStart
          let volume = (item.fadeOutEnd - contentFloatScroll) / extent;
          audioElement.volume = volume;
        }
      }
      if (item.fadeInStart) {
        if (item.fadeInStart <= contentFloatScroll && item.fadeInEnd > contentFloatScroll) {
          let extent = item.fadeInEnd - item.fadeInStart
          let volume = (contentFloatScroll - item.fadeInStart) / extent;
          audioElement.volume = volume;
        }
      }
    }
  })
  if (soundIsOn() || muteStateChanged) {
    mediaCollection.forEach((item) => updateMedia(item));
  }
}

let updatemediaCollectionListener = () => {
  app.logger('.');
  app.logger('updatemediaCollectionListener');
  updatemediaCollection();
}

let processSoundControls = () => {
  if (app.firstUserSoundOnRequest) {
    audioElement.removeAttribute('muted');
    audioElement.play();
    app.firstUserSoundOnRequest = false;
  }
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
  updatemediaCollection(true);
}

let silentSrc = './media/audio/silence-0.01s.mp3';

let createSilentAudioClip = () => {
  audioElement = document.createElement('audio');
  audioElement.id = 'audio';
  audioElement.src = silentSrc;
  audioElement.type = 'audio/mpeg';
  // audioElement.muted = 'muted';
  container.appendChild(audioElement);
};

//
// startup() called when dom-ready
//

// eslint-disable-next-line no-unused-vars
const startup = (id, audios, animations) => {
  container = document.getElementById(id);
  createSilentAudioClip();

  animationFrameImg = document.getElementById('animation-frame');

  storeScrollArguments = [animations, animationFrameImg];
  document.addEventListener('scroll',
    debounce(storeScrollListener), { passive: true });

  // Update scroll position for first time
  storeScroll(animations, animationFrameImg);

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
      if (audioElement.src == silentSrc) {
        audioElement.play();
      }
      processSoundControls();
    });
    muteButtons = document.querySelectorAll('.mute-button.secondary');

    muteButtons.forEach((muteButton) => {
      muteButton.addEventListener('click', () => {
        processSoundControls(muteButton);
      })
    })
    document.addEventListener('scroll', debounce(updatemediaCollectionListener), { passive: true });

    mediaCollection.forEach((item) => {
      if (audios) {
        let audio = audios.find((a) => a.id == item.id);
        if (audio) {
          item.fadeOutStart = audio.fadeOutStart;
          item.fadeOutEnd = audio.fadeOutEnd;
        }
      }
      item.container.addEventListener('transitionend', updatemediaCollectionListener)
    })

    window.setInterval(() => {
      updatemediaCollectionListener
    }, 250)

  }
}
