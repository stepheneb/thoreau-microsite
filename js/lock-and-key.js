/*jshint esversion: 8 */
/*global  */

import { app } from "./modules/globals.js"
import { startup } from './modules/artifact.js';

let animations = [{
    imgPrefix: 'lock-and-key/Coin+Jail+Town_',
    startFrame: 0,
    peakFrame: 45,
    endFrame: 101,
    startScroll: 2.1,
    endScroll: 4.98,
    startPage: 2,
    endPage: 5,
  },
  {
    imgPrefix: 'lock-and-key/Coin+Jail+Town_',
    startFrame: 102,
    peakFrame: 142,
    endFrame: 176,
    startScroll: 5.1,
    endScroll: 7.98,
    startPage: 5,
    endPage: 8,
  },
  {
    imgPrefix: 'lock-and-key/Coin+Jail+Town_',
    startFrame: 177,
    endFrame: 254,
    startScroll: 8.1,
    endScroll: 10.8,
    startPage: 8,
    endPage: 11,
  }
];

app.maxContentScroll = 12;

app.dev = true;

const cacheAnimationImages = () => {
  app.logger('browser doesn\'t support <link rel="prefetch">, caching animatipn images manually with JavaScript');
  let frame, image, src, paddednum;
  let images = [];
  for (frame = 0; frame <= 254; frame++) {
    image = new Image();
    paddednum = frame.toString().padStart(5, '0');
    src = `./media/animations/lock-and-key/Coin+Jail+Town_${paddednum}.png`
    image.src = src;
    images.push(image);
  }
}

const prefetchLink = document.querySelector('link[rel="prefetch"]');
if (!prefetchLink.relList.supports('prefetch')) {
  cacheAnimationImages();
}

app.domReady(() => {
  startup('lock-and-key', animations);
});
