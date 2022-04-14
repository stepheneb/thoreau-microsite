/*jshint esversion: 8 */
/*global  */

import { app } from "./modules/globals.js"
import { startup } from './modules/artifact.js';

let animations = [{
  imgPrefix: 'lock-and-key/Coin+Jail+Town_',
  startFrame: 0,
  endFrame: 253,
  startScroll: 2.0,
  endScroll: 7.95,
  startPage: 2,
  endPage: 8,
}];

app.maxContentScroll = 12;

app.dev = true;

app.domReady(() => {
  startup('lock-and-key', animations);
});
