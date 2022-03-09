/*jshint esversion: 8 */
/*global */

export const pages = [{
    id: 'divider1',
    type: 'divider',
    size: 'wide',
    menu: 'mobile',
  },
  {
    id: 'who-was-thoreau',
    type: 'link',
    enabled: true,
    menu: 'mobile',
    name: 'Who was Thoreau?',
    location: "index.html",
  },
  {
    id: 'divider2',
    type: 'divider',
    menu: 'mobile',
  },
  {
    id: 'snowshoes',
    type: 'artifact',
    enabled: true,
    menu: 'all',
    name: 'Thoreau’s Snowshoes',
    location: "snowshoes.html",
    src: "media/images/snowshoes/thoreau-snowshoes-close.png"
  },
  {
    id: 'spyglass',
    type: 'artifact',
    enabled: true,
    menu: 'all',
    name: 'Thoreau’s Spyglass',
    location: "spyglass.html",
    src: "media/images/spyglass/spyglass.png"
  },
  {
    id: 'lock-and-key',
    type: 'artifact',
    enabled: false,
    menu: 'all',
    name: 'Lock and Key (Concord Jail)',
    location: "lock-and-key.html",
    src: "media/images/lock-and-key/lock-and-key.png"
  },
  {
    id: 'walking-stick',
    type: 'artifact',
    enabled: true,
    menu: 'all',
    name: 'Thoreau’s Walking Stick',
    location: "walking-stick.html",
    src: "media/images/walking-stick/walking-stick.png"
  },
  {
    id: 'flute',
    type: 'artifact',
    enabled: true,
    menu: 'all',
    name: 'Thoreau’s Flute',
    location: "flute.html",
    src: "media/images/flute/flute.png"
  },
  {
    id: 'desk',
    type: 'artifact',
    enabled: false,
    menu: 'all',
    name: 'Thoreau’s Desk',
    location: "desk.html",
    src: "media/images/desk/desk.png",
  },
  {
    id: 'main-menu',
    type: 'link',
    enabled: true,
    fragment: true,
    name: 'Main Menu',
    menu: 'desktop',
    location: "index.html",
  },
  {
    id: 'divider3',
    type: 'divider',
    menu: 'mobile',
  },
  {
    id: 'thoreau-collection',
    type: 'link',
    enabled: true,
    name: 'Thoreau Collection',
    menu: 'mobile',
    location: "http://www.concordcollection.org/mExhibit.aspx?rID=Thoreau%20Collection&amp;dir=PERMANENT",
  },
  {
    id: 'educator-resources',
    type: 'link',
    enabled: true,
    name: 'Educator Resources',
    menu: 'mobile',
    location: "http://www.concordcollection.org/mExhibit.aspx?rID=Thoreau%20Collection&amp;dir=PERMANENT",
  }
]
