/*jshint esversion: 8 */
/*global  app startup */
//
// move these to spyglass.js
//

const animationFrameCallback = (animationFrameNum, animationFrameImg) => {
  if (animationFrameNum >= 0) {
    let paddedFrameNum = (animationFrameNum).toString().padStart(5, '0');
    let newSrc = `media/images/animations/spyglass/Spyglass_PNGSeq_01__${paddedFrameNum}.png`;
    if (animationFrameImg.src !== newSrc) {
      animationFrameImg.src = newSrc;
    }
  }
}

let audios = [{
    id: 'curious',
    src: './media/audio/spyglass/2-thoreau-did-have-a-curious-mind.mp3',
    fadeInStart: 2.0,
    fadeInEnd: 2.25,
    fadeOutStart: 3.5,
    fadeOutEnd: 4.0
  },
  {
    id: 'his-experiments',
    src: './media/audio/spyglass/3-his-experiments-his-observations.mp3',
    fadeInStart: 4.0,
    fadeInEnd: 4.25,
    fadeOutStart: 5.5,
    fadeOutEnd: 6.0
  },
  {
    id: 'some-scientific',
    src: './media/audio/spyglass/5-some-scientific-work.mp3',
    fadeInStart: 6.0,
    fadeInEnd: 6.25,
    fadeOutStart: 7.5,
    fadeOutEnd: 8.0
  }
];

let animations = [{
    callback: animationFrameCallback,
    startFrame: 46,
    endFrame: 152,
    startScroll: 1.95,
    endScroll: 3.5
  },
  {
    callback: animationFrameCallback,
    startFrame: 152,
    endFrame: 243,
    startScroll: 4.0,
    endScroll: 5.5
  }
];

app.maxContentScroll = 8;

// app.dev = true;

app.domReady(startup('spyglass', audios, animations));
