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

let animation = {
  callback: animationFrameCallback,
  startFrame: 46,
  countFrames: 244 - 46,
  startScroll: 1.55,
  scrollLength: 2
}
app.maxContentScroll = 8;

app.domReady(startup('spyglass', animation));
