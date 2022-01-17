/*jshint esversion: 8 */
/*global  app */

app.firstUserSoundOnRequest = true;

let contentScroll, contentScrollFLoat;
let previousContentScrollFLoat = 0;

let audioPlayerCollection, audioBackgroundCollection, videoBackgroundCollection;
let silentAudioElement;

let container, animationFrameImg, zoomMinus, zoomPlus, artifactImage, storeScrollArguments;

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

class SectionLogger {
  constructor() {
    this.animationFrameNum;
  }
  log(csFloat) {
    if (typeof this.animationFrameNum == 'number')
      app.logger('section:', csFloat.toFixed(2), ', anim:', this.animationFrameNum);
    else {
      app.logger('section:', csFloat.toFixed(2));
    }
    this.animationFrameNum = undefined;
  }
}

let sLogger = new SectionLogger();

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
    sLogger.animationFrameNum = result.frameNum;

  }
  contentScrollFLoat = Math.min(app.maxContentScroll, contentScrollFLoat);
  container.dataset.contentScrollFloat = contentScrollFLoat;
  container.dataset.contentScroll = contentScroll;
  container.dataset.scrollY = window.scrollY;
  container.dataset.innerHeight = window.innerHeight;
  container.dataset.innerWidth = window.innerWidth;
  container.dataset.aspectRatio = aspectRatio;

  if (app.dev) {
    if (Math.abs(contentScrollFLoat - previousContentScrollFLoat) >= 0.01) {
      // let ts = (performance.now() / 1000).toFixed(2);
      previousContentScrollFLoat = contentScrollFLoat;
      sLogger.log(contentScrollFLoat);
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
    this.media = wrapper.querySelector('audio,video');
    this.isAudio = this.isAudioMedia(this.media);
    this.isVideo = this.isVideoMedia(this.media);
    this.style;
    this.visible;
    this.visibility;
    this.opacity;
    this.paused;
    this.stopping = false;
    this.played = false;
    this.volume = 1;
    this.fadein = 300;
    this.fadeout = 300;
    this.resetVisibilityState();
  }

  isVideoMedia() {
    let proto = Object.prototype.toString.call(this.media).slice(8, -1).toLowerCase();
    return proto == 'htmlvideoelement';
  }

  isAudioMedia() {
    let proto = Object.prototype.toString.call(this.media).slice(8, -1).toLowerCase();
    return proto == 'htmlaudioelement';
  }

  // 1..0 => easein, easout 1..0
  easeinEaseout(vin, low_v, high_v) {
    let range = high_v - low_v;
    let vinScaled = (vin - low_v) * 1 / range;
    let x = Math.abs(vinScaled - 1);
    let easedX = 0.5 * (Math.cos(x * Math.PI) + 1);
    let vout = easedX * range / 1 + low_v;
    // app.logger(vin, low_v, high_v, vout);
    return vout;
  }

  getStyle() {
    this.style = getComputedStyle(this.wrapper);
    return this.style;
  }

  getCurrentVisiblity() {
    this.getStyle();
    let currentVisibility = this.style.visibility == 'visible' && this.style.opacity == '1' && this.style.display != 'none';
    return currentVisibility;
  }

  visibilityChanged() {
    let previousVisibility = this.visible;
    let currentVisibility = this.getCurrentVisiblity();
    let changed = currentVisibility != previousVisibility;
    if (changed) {
      let transitionPoint = currentVisibility ? 'completed' : 'started';
      app.logger(this.id, `visibility ${transitionPoint} change to:`, currentVisibility, 'at', contentScrollFLoat.toFixed(2));
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

  sweepVolume(startVolume, endVolume, timePeriod, callback) {
    app.logger('');
    let endtest, lowV, highV;
    if (endVolume > startVolume) {
      lowV = startVolume;
      highV = endVolume;
      endtest = (v, eV) => {
        return v < eV
      }
    } else {
      endtest = (v, eV) => {
        lowV = endVolume;
        highV = startVolume;
        return v >= eV
      }
    }
    const interval = 1000 / 60;
    const volummeSweepExtent = endVolume - startVolume;
    const steps = timePeriod / interval;
    const volumeStep = volummeSweepExtent / steps;
    let volume = startVolume
    this.media.volume = volume;
    app.logger('start-volume', volume, 'volumeStep', volumeStep);
    let startTimestamp = performance.now();
    let sweep = (timestamp) => {
      let duration = timestamp - startTimestamp;
      volume += volumeStep;
      if (endtest(volume, endVolume)) {
        this.media.volume = this.easeinEaseout(volume, lowV, highV);
        app.logger('-', volume.toFixed(2), this.media.volume.toFixed(2), duration.toFixed(0));
        window.requestAnimationFrame(sweep);
      } else {
        this.media.volume = endVolume;
        if (typeof callback == 'function') {
          callback();
        }
      }
    };
    window.requestAnimationFrame(sweep);
  }

  lowerVolume(vlow) {
    this.sweepVolume(this.volume, vlow, this.fadein)
  }

  raiseVolume() {
    this.sweepVolume(this.media.volume, this.volume, this.fadein)
  }

  stop() {
    let stopMedia = () => {
      this.sweepVolume(this.volume, 0, this.fadeout, () => {
        this.media.pause();
        this.stopping = false;
        this.stopped = true;
        this.media.volume = 1;
        this.media.muted = false;
      })
    }
    if (this.isPlaying() && !this.stopping) {
      stopMedia();
    }
  }

  play() {
    this.sweepVolume(0, this.volume, this.fadein)
    this.media.play();
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

  play() {
    audioBackgroundCollection.items.forEach(item => {
      if (item.isPlaying()) {
        item.lowerVolume(this.volume * 0.3)
      }
    });
    super.play();
  }

  stop() {
    super.stop();
    audioBackgroundCollection.items.forEach(item => {
      if (item.isPlaying()) {
        item.raiseVolume()
      }
    });
  }

  update() {
    this.resetVisibilityState();
    if (this.isPlaying() && this.isNotVisible()) {
      this.stop();
      this.media.currentTime = 0;
      this.playpause.classList.remove('playing');
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

class AudioBackgroundItem extends MediaItem {
  constructor(audioWrapper) {
    super(audioWrapper);
    this.media.loop = true;
    this.mutedState = true;
    this.onChildren = this.wrapper.querySelectorAll('*.on');
    this.offChildren = this.wrapper.querySelectorAll('*.off');
    this.volume = 1;
    this.fadein = 1000;
    this.fadeout = 400;

    this.wrapper.addEventListener('click', () => {
      if (this.mutedState) {
        this.mutedState = false;
        this.updateMuteBtnView();
        this.play();
      } else {
        this.mutedState = true;
        this.updateMuteBtnView();
        this.stop();
      }
    })
  }

  update() {
    this.resetVisibilityState();
    if (this.isPlaying() && this.isNotVisible()) {
      this.stop();
    }
    if (this.isVisible() && !this.mutedState) {
      this.play();
    }
  }

  updateMuteBtnView() {
    if (this.mutedState) {
      this.onChildren.forEach((el) => {
        el.style.display = 'none';
      })
      this.offChildren.forEach((el) => {
        el.style.display = 'block';
      })
    } else {
      this.offChildren.forEach((el) => {
        el.style.display = 'none';
      })
      this.onChildren.forEach((el) => {
        el.style.display = 'block';
      })
    }
  }
}

class VideoBackgroundItem extends MediaItem {
  constructor(videoWrapper) {
    super(videoWrapper);
    this.media.loop = true;
    this.media.addEventListener('canplay', () => {
      this.update();
    });
  }
  update() {
    this.resetVisibilityState();
    if (this.isNotVisible()) {
      this.media.pause();
    }
    if (this.isVisible()) {
      this.media.play();
    }
  }
}

// class VideoPlayerItem extends MediaItem {
//   constructor(audio) {
//     super(audio);
//   }
// }
//

class MediaCollection {
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
  audioPlayerCollection.update();
  audioBackgroundCollection.update();
  videoBackgroundCollection.update();
}

//
// startup() called when dom-ready
//

// eslint-disable-next-line no-unused-vars
const startup = (id, animations) => {
  container = document.getElementById(id);
  createSilentAudioClip();

  // audioPlayers = makeItems('audio.player', AudioPlayerItem);
  // audioBackgrounds = makeItems('audio.background', AudioBackgroundItem);
  // videoPlayers = makeItems('video.player', VideoPlayerItem);

  audioPlayerCollection = new MediaCollection('.audio.player', AudioPlayerItem);
  audioBackgroundCollection = new MediaCollection('.audio.background', AudioBackgroundItem);
  videoBackgroundCollection = new MediaCollection('.video.background', VideoBackgroundItem);

  // videoBackgrounds = makeItems('video.background', VideoBackgroundItem);

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

  window.setInterval(() => {
    updateMCollectionListener();
  }, 250)
}

app.dev = true;
