/*jshint esversion: 8 */
/*global */

import { app } from "./modules/globals.js"
import { startup } from './modules/artifact.js';

app.maxContentScroll = 2;

app.dev = true;

app.domReady(() => {
  startup('snowshoes');
});
