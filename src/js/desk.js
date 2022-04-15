/*jshint esversion: 8 */
/*global  */

import { app } from "./modules/globals.js"
import { startup } from './modules/artifact.js';

let animations = [{
  imgPrefix: 'desk/Journal_',
  startFrame: 0,
  endFrame: 128,
  startScroll: 2.2,
  endScroll: 6.98,
  startPage: 2,
  endPage: 7,
}];

app.maxContentScroll = 12;

app.dev = true;

app.domReady(() => {
  startup('desk', animations);
});
