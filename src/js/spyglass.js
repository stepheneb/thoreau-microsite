/*jshint esversion: 8 */
/*global  */

import { app } from "./modules/globals.js"
import { startup } from './modules/artifact.js';

let animations = [{
    imgPrefix: 'spyglass/spyglass_animals_10fps/Render_Spyglass+Animals_10_fps_',
    startFrame: 0,
    endFrame: 144,
    startScroll: 1.95,
    endScroll: 4.5,
    startPage: 1,
    endPage: 4,
  },
  {
    imgPrefix: 'spyglass/trees_02_10fps/Render_Trees_10_fps_',
    startFrame: 0,
    endFrame: 99,
    startScroll: 5.0,
    endScroll: 8.5,
    startPage: 5,
    endPage: 9,
  }
];

app.maxContentScroll = 12;

app.dev = true;

app.domReady(() => {
  startup('spyglass', animations);
});
