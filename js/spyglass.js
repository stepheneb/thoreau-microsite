/*jshint esversion: 8 */
/*global  */

import { app } from "./modules/globals.js"
import { startup } from './modules/artifact.js';

let animations = [{
    imgPrefix: 'spyglass/Spyglass_PNGSeq_01__',
    startFrame: 46,
    endFrame: 160,
    startScroll: 1.95,
    endScroll: 4.5,
    startPage: 1,
    endPage: 4,
  },
  {
    imgPrefix: 'spyglass/Spyglass_PNGSeq_01__',
    startFrame: 161,
    endFrame: 243,
    startScroll: 5.0,
    endScroll: 8.5,
    startPage: 5,
    endPage: 9,
  }
];

app.maxContentScroll = 13;

app.dev = true;

app.domReady(() => {
  startup('spyglass', animations);
});
