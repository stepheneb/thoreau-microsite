/*jshint esversion: 8 */
/*global  */

import { app } from "./globals.js";
import { scrollerSetup } from './scroller.js';
import { zoom } from "./zoom.js";

app.logger(zoom);

app.firstUserSoundOnRequest = true;

//
// startup() called when dom-ready
//
export const startup = (id, animations) => {
  const container = document.getElementById(id);

  scrollerSetup(container, animations);
}
