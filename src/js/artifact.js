/*jshint esversion: 8 */
/*global  app */

app.firstUserSoundOnRequest = true;

let contentScroll, contentScrollFLoat;
let previousContentScrollFLoat = 0;

let audioCollection, audioPlayers, videoPlayers, audioBackgrounds, videoBackgrounds, silentAudioElement;

let unmuteFooter, backgroundSoundButton, container, animationFrameImg,
  zoomMinus, zoomPlus, artifactImage, storeScrollArguments;

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
  contentScrollFLoat = window.scrollY / window.innerHeight + contentViewportOffset;
  contentScroll = Math.floor(contentScrollFLoat);
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

  if (app.dev) {
    if (Math.abs(contentScrollFLoat - previousContentScrollFLoat) >= 0.09) {
      previousContentScrollFLoat = contentScrollFLoat;
      app.logger(contentScrollFLoat.toFixed(1));
    }
  }

};

const storeScrollListener = (e, ...args) => {
  storeScroll(...args);
  setTimeout(() => {
    updateMCollectionListener();
  });
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

// let mediaCollection = [];
//
// document.querySelectorAll('audio, video').forEach((mediaPlayer) => {
//   let container = mediaPlayer.parentElement;
//   if (isVideo(mediaPlayer)) {
//     container = container.parentElement;
//   }
//   let id = mediaPlayer.parentElement.parentElement.id;
//   let computedStyle = getComputedStyle(container);
//   let visibility = computedStyle.visibility;
//   let opacity = computedStyle.opacity;
//   mediaCollection.push({
//     id: id,
//     mediaPlayer: mediaPlayer,
//     container: container,
//     computedStyle: computedStyle,
//     visibility: visibility,
//     opacity: opacity,
//     played: false,
//     startPlayTimeoutID: null
//   })
// })

// let updateMediaCollection = () => {
//   let contentFloatScroll = document.body.dataset.contentScrollFloat;
//   if (contentFloatScroll) {
//     contentFloatScroll = +contentFloatScroll;
//   }
//   let isVideoItem = (item) => {
//     return isVideo(item.mediaPlayer);
//   }
//   let isAudioItem = (item) => {
//     return isAudio(item.mediaPlayer);
//   }
//   let isBackgroundSound = (item) => {
//     return isAudio(item.mediaPlayer) && item.mediaPlayer.id == 'background-sounds';
//   }
//
//   let isVisible = (item) => {
//     return item.visibility == 'visible' && item.opacity == 1;
//   }
//   let isNotVisible = (item) => {
//     return item.visibility == 'hidden' || item.opacity < 1;
//   }
//
//   let visibilityChanged = (item) => {
//     item.computedStyle = getComputedStyle(item.container);
//     let currentVisibility = item.computedStyle.visibility;
//     let currentOpacity = item.computedStyle.opacity;
//     let changed = item.visibility != currentVisibility || item.opacity != currentOpacity;
//     if (changed) {
//       item.visibility = currentVisibility;
//       item.opacity = currentOpacity;
//     }
//     return changed;
//   }
//
//   let paused = (item) => {
//     let p = item.mediaPlayer.paused;
//     app.logger('paused', item.mediaPlayer.id, p);
//     return p;
//   }
//   // let reset = (item) => {
//   //   app.logger('reset', item.mediaPlayer.id);
//   //   item.mediaPlayer.currentTime = 0;
//   //   silentAudioElement.currentTime = 0;
//   // }
//
//   let stopAudio = (item) => {
//     app.logger('stopAudio()', item.mediaPlayer.id);
//     if (isAudioItem(item)) {
//       item.mediaPlayer.currentTime = 0;
//       if (item.mediaPlayer.src == silentAudioElement.src) {
//         silentAudioElement.pause();
//         silentAudioElement.currentTime = 0;
//       }
//       window.clearTimeout(item.startPlayTimeoutID);
//     } else if (isVideoItem(item)) {
//       item.mediaPlayer.setAttribute('muted', 'muted')
//       item.mediaPlayer.muted = true;
//       window.clearTimeout(item.startPlayTimeoutID);
//     } else {
//       console.error('unknow media type:', item.mediaPlayer);
//     }
//   }
//   // let stopAll = () => {
//   //   mediaCollection.forEach((item) => stopAudio(item));
//   // }
//
//   let stopOthers = (item) => {
//     mediaCollection.forEach((i) => {
//       if (i.id !== item.id) {
//         stopAudio(i);
//       }
//     })
//   }
//
//   let play = (item) => {
//     app.logger('play', item.mediaPlayer.id);
//     if (isAudioItem(item)) {
//       stopOthers(item);
//       item.startPlayTimeoutID = setTimeout(() => {
//         item.mediaPlayer.play();
//         item.mediaPlayer.volume = 1;
//       }, startPlayDelay);
//     } else if (isVideoItem(item)) {
//       item.startPlayTimeoutID = setTimeout(() => {
//         item.mediaPlayer.play();
//       }, startPlayDelay);
//     }
//     item.played = true;
//   }
//
//   let updateMedia = (item) => {
//     if (isVisible(item)) {
//       if (isBackgroundSound(item) && backgroundSoundIsOn()) {
//         if (paused(item)) {
//           item.mediaPlayer.play();
//         }
//       }
//     } else {
//       app.logger(`${item.id} not visible, stop playing:`, item.mediaPlayer.id);
//       // stopAudio(item);
//
//     }
//   }
//   mediaCollection.forEach((item) => {
//     if (visibilityChanged(item)) {
//       app.logger(item.id || item.mediaPlayer.id, '=========>', item.computedStyle.visibility);
//       if (isNotVisible(item)) item.played = false;
//       if (isVideoItem(item)) {
//         if (isVisible(item)) {
//           play(item);
//         } else {
//           stopAudio(item);
//         }
//       }
//     } else {
//       app.logger(item.id, ':', item.computedStyle.visibility);
//     }
//     if (isAudioItem(item)) {
//       if (item.fadeOutStart) {
//         if (item.fadeOutStart <= contentFloatScroll && item.fadeOutEnd > contentFloatScroll) {
//           let extent = item.fadeOutEnd - item.fadeOutStart
//           let volume = (item.fadeOutEnd - contentFloatScroll) / extent;
//           item.mediaPlayer.volume = volume;
//         }
//       }
//       if (item.fadeInStart) {
//         if (item.fadeInStart <= contentFloatScroll && item.fadeInEnd > contentFloatScroll) {
//           let extent = item.fadeInEnd - item.fadeInStart
//           let volume = (contentFloatScroll - item.fadeInStart) / extent;
//           item.mediaPlayer.volume = volume;
//         }
//       }
//     }
//   })
//   mediaCollection.forEach((item) => updateMedia(item));
// }
//
// let updateMediaCollectionListener = () => {
//   app.logger('.');
//   app.logger('updateMediaCollectionListener');
//   updateMediaCollection();
// }
//
// let processSoundControls = () => {
//   if (app.firstUserSoundOnRequest) {
//     silentAudioElement.removeAttribute('muted');
//     silentAudioElement.play();
//     app.firstUserSoundOnRequest = false;
//   }
//
//   let updateSoundControl = (el) => {
//     let onChildren = el.querySelectorAll('*.on');
//     let offChildren = el.querySelectorAll('*.off');
//     let currentState = backgroundSoundButton.dataset.sound;
//     if (currentState == 'off') {
//       backgroundSoundOnOff = 'on';
//       backgroundSoundButton.dataset.sound = backgroundSoundOnOff;
//       onChildren.forEach((el) => {
//         el.style.display = 'block';
//       })
//       offChildren.forEach((el) => {
//         el.style.display = 'none';
//       })
//     } else if (currentState == 'on') {
//       backgroundSoundOnOff = 'off';
//       backgroundSoundButton.dataset.sound = backgroundSoundOnOff;
//       onChildren.forEach((el) => {
//         el.style.display = 'none';
//       })
//       offChildren.forEach((el) => {
//         el.style.display = 'block';
//       })
//     }
//     app.logger('background sound:', backgroundSoundOnOff);
//   }
//
//   if (unmuteFooter.enabled) {
//     if (backgroundSoundIsOn()) {
//       unmuteFooter.classList.add('on');
//     } else {
//       unmuteFooter.classList.remove('on');
//     }
//   }
//
//   updateSoundControl(backgroundSoundButton);
//   updateMediaCollection();
// }

let silentSrc = './media/audio/silence-0.01s.mp3';

let createSilentAudioClip = () => {
  silentAudioElement = document.createElement('audio');
  silentAudioElement.id = 'audio';
  silentAudioElement.src = silentSrc;
  silentAudioElement.type = 'audio/mpeg';
  // silentAudioElement.muted = 'muted';
  container.appendChild(silentAudioElement);
};

class MediaItem {
  isAudio(player) {
    let proto = Object.prototype.toString.call(player).slice(8, -1).toLowerCase();
    return proto == 'htmlaudioelement';
  }
  isVideo(player) {
    let proto = Object.prototype.toString.call(player).slice(8, -1).toLowerCase();
    return proto == 'htmlvideoelement';
  }
  constructor(wrapper) {
    this.wrapper = wrapper;
    this.id = wrapper.id;
    this.media = wrapper.querySelector('audio');

    this.isAudio = isAudio(this.media);
    this.isVideo = isVideo(this.media);

    // if (this.isVideo) {
    //   this.wrapper = media.parentElement.parentElement;
    // } else {
    //   this.wrapper = media.parentElement;
    // }

    this.style;
    this.visible;
    this.visibility;
    this.opacity;

    this.paused;

    this.stopping = false;

    this.played = false;

    this.volume = 1;
    this.fadein = 500;
    this.fadeout = 500;

    this.resetVisibilityState();
    // this.startPlayDelay = 500;
    // this.mediaSetIntervalID = null;
  }

  // 1..0 => easein, easout 1..0
  easeinEaseout(x) {
    return (Math.cos(Math.PI * x) + 1) / 2;
  }

  getStyle() {
    this.style = getComputedStyle(this.wrapper);
    return this.style;
  }

  getCurrentVisiblity() {
    this.getStyle();
    let currentVisibility = this.style.visibility == 'visible' && this.style.opacity == '1';
    return currentVisibility;
  }

  visibilityChanged() {
    let previousVisibility = this.visible;
    let currentVisibility = this.getCurrentVisiblity();
    let changed = currentVisibility != previousVisibility;
    if (changed) {
      app.logger(contentScrollFLoat.toFixed(1), 'changed:', changed, ', previous:', previousVisibility, ', current:', currentVisibility);
    }
    return changed;
  }

  isVisible() {
    this.visible = this.getCurrentVisiblity()
    return this.visible;
  }

  resetVisibilityState() {
    this.isVisible();
  }

  isNotVisible() {
    return !this.isVisible();
  }

  isPaused() {
    this.paused = this.media.paused;
    return this.paused;
  }

  isPlaying() {
    return !this.isPaused();
  }

  isStopping() {
    return this.isStopping;
  }

  isNotStopping() {
    return !this.isStopping;
  }

  currentTime() {
    return this.media.currentTime;
  }

  duration() {
    let duration = this.media.duration;
    if (isNaN(duration)) {
      duration = 0;
    }
    return duration;
  }

  stop() {
    let stopAudio = () => {
      this.stopping = true;
      const endVolume = 0;
      const interval = 1000 / 60;
      const volummeSweepExtent = endVolume - this.volume;
      const steps = this.fadeout / interval;
      const volumeStep = volummeSweepExtent / steps;
      let volume = this.volume;
      this.media.volume = volume;
      let startTimestamp = performance.now();
      let sweep = (timestamp) => {
        let duration = timestamp - startTimestamp;
        app.logger(volume.toFixed(2), duration.toFixed(0));
        volume += volumeStep;
        if (volume > endVolume) {
          this.media.volume = volume;
          window.requestAnimationFrame(sweep);
        } else {
          this.media.volume = endVolume;
          this.media.pause();
          this.stopping = false;
          this.stopped = true;
          this.media.currentTime = 0;
          this.media.volume = 1;
          this.media.muted = false;
        }
      };
      window.requestAnimationFrame(sweep);
    }

    if (this.isAudio)
      if (this.isPlaying() && !this.stopping) {
        stopAudio();
      }
  }

  play() {
    let playAudio = () => {
      const startVolume = 0;
      const interval = 1000 / 60;
      const volummeSweepExtent = this.volume - startVolume;
      const steps = this.fadein / interval;
      const volumeStep = volummeSweepExtent / steps;
      let volume = 0;
      let startTimestamp = performance.now();
      let sweep = (timestamp) => {
        let duration = timestamp - startTimestamp;
        app.logger(volume.toFixed(2), duration.toFixed(0));
        volume += volumeStep;
        if (volume < this.volume) {
          this.media.volume = volume;
          window.requestAnimationFrame(sweep);
        } else {
          this.media.volume = this.volume;
        }
      };

      this.media.volume = volume;
      this.media.play();
      window.requestAnimationFrame(sweep);
    }

    if (this.isAudio) {
      playAudio();

    }

    if (this.isVideo) {
      this.startPlayTimeoutID = setTimeout(() => {
        this.media.play();
      }, this.startPlayDelay);
    }
  }

}

class AudioPlayerItem extends MediaItem {

  constructor(audioWrapper) {
    super(audioWrapper);

    this.playpause = this.wrapper.querySelector('.playpause');
    this.playBtn = this.wrapper.querySelector('.play');
    this.pauseBtn = this.wrapper.querySelector('.pause');
    this.timeDisplay = this.wrapper.querySelector('.time-display');
    this.currentTimeEl = this.timeDisplay.querySelector('.current')
    this.durationEl = this.timeDisplay.querySelector('.duration')

    this.progressDisplay = this.wrapper.querySelector('.progress-indicator');
    this.elapsedBar = this.progressDisplay.querySelector('.elapsed');
    this.remainingBar = this.progressDisplay.querySelector('.remaining');

    this.playBtn.addEventListener('click', () => {
      this.playpause.classList.add('playing');
      this.play();
    });

    this.pauseBtn.addEventListener('click', () => {
      this.playpause.classList.remove('playing');
      this.stop();
    });

    this.media.addEventListener('timeupdate', () => {
      this.updateCurrentTime();
    })

    this.media.addEventListener('durationchange', () => {
      this.updateDuration();
    })

    this.media.addEventListener('ended', () => {
      this.playpause.classList.remove('playing');
      this.media.currentTime = 0;
      this.updateDuration();
    })

    this.updateCurrentTime();
  }

  update() {
    this.resetVisibilityState();
    if (this.isPlaying() && this.isNotVisible()) {
      this.stop();
    }
  }

  secondsToTimeStr(seconds) {
    let str = new Date(seconds * 1000).toISOString().substr(14, 5);
    if (seconds < 600) {
      str = str.substr(1);
    }
    return str;
  }

  updateCurrentTime() {
    let time = this.secondsToTimeStr(this.currentTime());
    this.currentTimeEl.innerText = time;
    this.updateProgressBar();
  }

  updateDuration() {
    let time = this.secondsToTimeStr(this.duration());
    this.durationEl.innerText = time;
    this.updateProgressBar();
  }

  updateProgressBar() {
    let elapsed = this.currentTime();
    let duration = this.duration();
    let elapsedWidth = 0;
    let remainingWidth = 100;
    if (duration > 0) {
      elapsedWidth = elapsed / duration * 100;
      remainingWidth = (duration - elapsed) / duration * 100;
    }
    this.elapsedBar.style.width = `${elapsedWidth}%`;
    this.remainingBar.style.width = `${remainingWidth}%`;
  }

  stylePlaying(playing) {
    if (playing) {
      this.playBtn.classList.remove('paused');
      this.pauseBtn.classList.add('playing');
    } else {
      this.pauseBtn.classList.remove('playing');
      this.playBtn.classList.add('paused');
    }
  }

}

class VideoPlayerItem extends MediaItem {
  constructor(audio) {
    super(audio);
  }
}

class AudioBackgroundItem extends MediaItem {
  constructor(audio) {
    super(audio);
  }
}

class VideoBackgroundItem extends MediaItem {
  constructor(video) {
    super(video);
  }
}

class AudioPlayerCollection {
  constructor(selector, klass) {
    let elArray = Array.from(document.querySelectorAll(selector));
    this.items = elArray.map(el => new klass(el));
  }
  update() {
    this.items.forEach(item => {
      if (item.visibilityChanged()) {
        item.update();
      }
    });
  }
}

let updateMCollectionListener = () => {
  audioCollection.update();
}

//
// startup() called when dom-ready
//

// eslint-disable-next-line no-unused-vars
const startup = (id, animations) => {
  container = document.getElementById(id);
  createSilentAudioClip();

  function makeItems(selector, klass) {
    let elArray = Array.from(document.querySelectorAll(selector));
    return elArray.map(el => new klass(el));
  }

  // audioPlayers = makeItems('audio.player', AudioPlayerItem);

  audioCollection = new AudioPlayerCollection('.audio.player', AudioPlayerItem);

  videoPlayers = makeItems('video.player', VideoPlayerItem);

  audioBackgrounds = makeItems('audio.background', AudioBackgroundItem);

  videoBackgrounds = makeItems('video.background', VideoBackgroundItem);

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

  // unmuteFooter = document.getElementById('unmute-footer');
  // unmuteFooter.enabled = window.getComputedStyle(unmuteFooter).display !== 'none;'

  // backgroundSoundButton = document.getElementById('unmute-footer-button');
  backgroundSoundButton = document.getElementById('mute-button');
  backgroundSoundOnOff = 'off';
  backgroundSoundButton.dataset.sound = backgroundSoundOnOff;

  if (backgroundSoundButton) {
    backgroundSoundButton.addEventListener('click', () => {
      app.logger('mute-on-off clicked');
      // processSoundControls();
    });
  }

  // document.addEventListener('scroll', debounce(updateMCollectionListener), { passive: true });

  // window.setInterval(() => {
  //   updateMCollectionListener
  // }, 250)
}

app.dev = true;
