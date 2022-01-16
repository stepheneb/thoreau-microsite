/*jshint esversion: 8 */
/*global  app startup */
//
// move these to spyglass.js
//

const animationFrameCallback = (animationFrameNum, animationFrameImg, isVisible = true) => {
  let updateSrc = (newSrc) => {
    if (animationFrameImg.src !== newSrc) {
      animationFrameImg.src = newSrc;
    }

  }
  if (animationFrameNum >= 0 && isVisible) {
    let paddedFrameNum = (animationFrameNum).toString().padStart(5, '0');
    updateSrc(`./media/images/animations/spyglass/Spyglass_PNGSeq_01__${paddedFrameNum}.png`);
  }
  if (!isVisible) {
    updateSrc('./media/images/transparent.png');
  }
}

// let audios = [{
//     id: 'curious',
//     src: './media/audio/spyglass/2-thoreau-did-have-a-curious-mind.mp3',
//     fadeInStart: 2.0,
//     fadeInEnd: 2.25,
//     fadeOutStart: 4.5,
//     fadeOutEnd: 5.0
//   },
//   {
//     id: 'his-experiments',
//     src: './media/audio/spyglass/3-his-experiments-his-observations.mp3',
//     fadeInStart: 5.0,
//     fadeInEnd: 5.25,
//     fadeOutStart: 8.5,
//     fadeOutEnd: 9.0
//   },
//   {
//     id: 'some-scientific',
//     src: './media/audio/spyglass/5-some-scientific-work.mp3',
//     fadeInStart: 9.0,
//     fadeInEnd: 9.25,
//     fadeOutStart: 10.5,
//     fadeOutEnd: 11.0
//   }
// ];

let animations = [{
    callback: animationFrameCallback,
    startFrame: 46,
    endFrame: 160,
    startPage: 1,
    endPage: 4,
    startScroll: 1.95,
    endScroll: 4.5
  },
  {
    callback: animationFrameCallback,
    startFrame: 161,
    endFrame: 243,
    startPage: 5,
    endPage: 10,
    startScroll: 5.0,
    endScroll: 8.5
  }
];

app.maxContentScroll = 12;

// app.dev = true;

app.domReady(startup('spyglass', animations));
