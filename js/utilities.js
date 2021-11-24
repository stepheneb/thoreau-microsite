/*jshint esversion: 8 */

// eslint-disable-next-line no-unused-vars
const domReady = (callBack) => {
  if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', callBack);
  } else {
    callBack();
  }
}

// eslint-disable-next-line no-unused-vars
const windowReady = (callBack) => {
  if (document.readyState === 'complete') {
    callBack();
  } else {
    window.addEventListener('load', callBack);
  }
}
