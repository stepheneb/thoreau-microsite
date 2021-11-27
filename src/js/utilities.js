/*jshint esversion: 8 */
/*global app */

// eslint-disable-next-line no-unused-vars
if (window.app === undefined) {
  window.app = {};
}

// app.dev = true;

// eslint-disable-next-line no-unused-vars
app.domReady = (callBack) => {
  if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', callBack);
  } else {
    callBack();
  }
}

// eslint-disable-next-line no-unused-vars
app.windowReady = (callBack) => {
  if (document.readyState === 'complete') {
    callBack();
  } else {
    window.addEventListener('load', callBack);
  }
}

// eslint-disable-next-line no-unused-vars
app.reflow = (element) => {
  if (element === undefined) {
    element = document.documentElement;
  }
  void(element.offsetHeight);
}

// const
// requestAnimationFrame(() => { setTimeout(() => {} });

// eslint-disable-next-line no-unused-vars
app.logger = (...args) => {
  if (app.dev) {
    console.log(...args);
  }
}
