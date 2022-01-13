/*jshint esversion: 8 */
/*global  app */

app.firstUserSoundOnRequest = true;

let unmuteFooter, backgroundSoundButton, container, animationFrameImg,
  zoomMinus, zoomPlus, artifactImage, silentAudioElement, storeScrollArguments;

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
  let aspectRatio = window.innerWidth / window.innerHeight;
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
  container.dataset.innerWidth = window.innerWidth;
  container.dataset.aspectRatio = aspectRatio;
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

let backgroundSoundOnOff = 'off';
let backgroundSoundIsOn = () => backgroundSoundOnOff == 'on';

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

let updateMediaCollection = () => {
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
  let isBackgroundSound = (item) => {
    return isAudio(item.mediaPlayer) && item.mediaPlayer.id == 'background-sounds';
  }

  let isVisible = (item) => {
    return item.visibility == 'visible' && item.opacity == 1;
  }
  let isNotVisible = (item) => {
    return item.visibility == 'hidden' || item.opacity < 1;
  }

  let visibilityChanged = (item) => {
    item.computedStyle = getComputedStyle(item.container);
    let currentVisibility = item.computedStyle.visibility;
    let currentOpacity = item.computedStyle.opacity;
    let changed = item.visibility != currentVisibility || item.opacity != currentOpacity;
    if (changed) {
      item.visibility = currentVisibility;
      item.opacity = currentOpacity;
    }
    return changed;
  }

  let paused = (item) => {
    let p = item.mediaPlayer.paused;
    app.logger('paused', item.mediaPlayer.id, p);
    return p;
  }
  // let reset = (item) => {
  //   app.logger('reset', item.mediaPlayer.id);
  //   item.mediaPlayer.currentTime = 0;
  //   silentAudioElement.currentTime = 0;
  // }

  let stopAudio = (item) => {
    app.logger('stopAudio()', item.mediaPlayer.id);
    if (isAudioItem(item)) {
      item.mediaPlayer.currentTime = 0;
      if (item.mediaPlayer.src == silentAudioElement.src) {
        silentAudioElement.pause();
        silentAudioElement.currentTime = 0;
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
        item.mediaPlayer.play();
        item.mediaPlayer.volume = 1;
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
      if (isBackgroundSound(item) && backgroundSoundIsOn()) {
        if (paused(item)) {
          item.mediaPlayer.play();
        }
      }
    } else {
      app.logger(`${item.id} not visible, stop playing:`, item.mediaPlayer.id);
      // stopAudio(item);

    }
  }
  mediaCollection.forEach((item) => {
    if (visibilityChanged(item)) {
      app.logger(item.id || item.mediaPlayer.id, '=========>', item.computedStyle.visibility);
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
    if (isAudioItem(item)) {
      if (item.fadeOutStart) {
        if (item.fadeOutStart <= contentFloatScroll && item.fadeOutEnd > contentFloatScroll) {
          let extent = item.fadeOutEnd - item.fadeOutStart
          let volume = (item.fadeOutEnd - contentFloatScroll) / extent;
          item.mediaPlayer.volume = volume;
        }
      }
      if (item.fadeInStart) {
        if (item.fadeInStart <= contentFloatScroll && item.fadeInEnd > contentFloatScroll) {
          let extent = item.fadeInEnd - item.fadeInStart
          let volume = (contentFloatScroll - item.fadeInStart) / extent;
          item.mediaPlayer.volume = volume;
        }
      }
    }
  })
  mediaCollection.forEach((item) => updateMedia(item));
}

let updateMediaCollectionListener = () => {
  app.logger('.');
  app.logger('updateMediaCollectionListener');
  updateMediaCollection();
}

let processSoundControls = () => {
  if (app.firstUserSoundOnRequest) {
    silentAudioElement.removeAttribute('muted');
    silentAudioElement.play();
    app.firstUserSoundOnRequest = false;
  }

  let updateSoundControl = (el) => {
    let onChildren = el.querySelectorAll('*.on');
    let offChildren = el.querySelectorAll('*.off');
    let currentState = backgroundSoundButton.dataset.sound;
    if (currentState == 'off') {
      backgroundSoundOnOff = 'on';
      backgroundSoundButton.dataset.sound = backgroundSoundOnOff;
      onChildren.forEach((el) => {
        el.style.display = 'block';
      })
      offChildren.forEach((el) => {
        el.style.display = 'none';
      })
    } else if (currentState == 'on') {
      backgroundSoundOnOff = 'off';
      backgroundSoundButton.dataset.sound = backgroundSoundOnOff;
      onChildren.forEach((el) => {
        el.style.display = 'none';
      })
      offChildren.forEach((el) => {
        el.style.display = 'block';
      })
    }
    app.logger('background sound:', backgroundSoundOnOff);
  }

  if (unmuteFooter.enabled) {
    if (backgroundSoundIsOn()) {
      unmuteFooter.classList.add('on');
    } else {
      unmuteFooter.classList.remove('on');
    }
  }

  updateSoundControl(backgroundSoundButton);
  updateMediaCollection();
}

let silentSrc = './media/audio/silence-0.01s.mp3';

let createSilentAudioClip = () => {
  silentAudioElement = document.createElement('audio');
  silentAudioElement.id = 'audio';
  silentAudioElement.src = silentSrc;
  silentAudioElement.type = 'audio/mpeg';
  // silentAudioElement.muted = 'muted';
  container.appendChild(silentAudioElement);
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

  window.addEventListener('resize',
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

  unmuteFooter = document.getElementById('unmute-footer');
  unmuteFooter.enabled = window.getComputedStyle(unmuteFooter).display !== 'none;'

  // backgroundSoundButton = document.getElementById('unmute-footer-button');
  backgroundSoundButton = document.getElementById('mute-button');
  backgroundSoundOnOff = 'off';
  backgroundSoundButton.dataset.sound = backgroundSoundOnOff;

  if (backgroundSoundButton) {
    backgroundSoundButton.addEventListener('click', () => {
      app.logger('mute-on-off clicked');
      processSoundControls();
    });
  }

  document.addEventListener('scroll', debounce(updateMediaCollectionListener), { passive: true });

  mediaCollection.forEach((item) => {
    if (audios) {
      let audio = audios.find((a) => a.id == item.id);
      if (audio) {
        item.fadeOutStart = audio.fadeOutStart;
        item.fadeOutEnd = audio.fadeOutEnd;
      }
    }
    item.container.addEventListener('transitionend', updateMediaCollectionListener)
  })

  window.setInterval(() => {
    updateMediaCollectionListener
  }, 250)
}

app.dev = true;
