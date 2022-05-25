import { app } from "./globals.js";

export const router = {};

router.getHash = (hashStr) => {
  let hashpath = [];
  let props = new URLSearchParams();
  let match = hashStr.match(/#(?<hash>[\w-/]+)(\?(?<search>.*$))?/);
  if (match && match.groups) {
    hashpath = match.groups.hash.split('/');
    props = new URLSearchParams(match.groups.search);
  }
  if (props.get('dev')) {
    app.dev = true;
  }
  return [hashpath, props];
};
