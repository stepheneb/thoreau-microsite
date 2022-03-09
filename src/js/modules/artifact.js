/*jshint esversion: 8 */
/*global  */

import { app } from "./globals.js";
import { scrollerSetup } from './scroller.js';
import { zoom, setupDragHandling } from "./zoom.js";
import { generateDropdownUL } from "./menu.js";

app.logger(zoom);

app.firstUserSoundOnRequest = true;

//
// startup() called when dom-ready
//
export const startup = (id, animations) => {
  const container = document.getElementById(id);
  generateDropdownUL(id);

  scrollerSetup(container, animations);
  setupDragHandling();

  const backToTop = document.getElementById('back-to-top');
  backToTop.addEventListener('click', () => {
    window.scrollTo(0, 0);
  })
}
