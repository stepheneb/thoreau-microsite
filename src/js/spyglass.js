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

let animations = [{
    callback: animationFrameCallback,
    startFrame: 46,
    endFrame: 152,
    startScroll: 1.95,
    endScroll: 3.5,
  },
  {
    callback: animationFrameCallback,
    startFrame: 152,
    endFrame: 243,
    startScroll: 4.0,
    endScroll: 5.5,
  }
];

app.maxContentScroll = 8;

app.domReady(startup('spyglass', animations));
