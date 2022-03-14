/*jshint esversion: 8 */
/*global */

export const pages = [{
    id: 'divider1',
    type: 'divider',
    size: 'wide',
    dropdownMenu: 'mobile',
    footerItem: false,
  },
  {
    id: 'who-was-thoreau',
    type: 'popup',
    enabled: true,
    dropdownMenu: 'mobile',
    name: 'Who was Thoreau?',
    location: "index.html",
    footerItem: true,
  },
  {
    id: 'divider2',
    type: 'divider',
    dropdownMenu: 'mobile',
    footerItem: false,
  },
  {
    id: 'snowshoes',
    type: 'artifact',
    enabled: true,
    dropdownMenu: 'all',
    name: 'Thoreau’s Snowshoes',
    location: "snowshoes.html",
    src: "media/images/snowshoes/thoreau-snowshoes-close.png",
    footerItem: false,
  },
  {
    id: 'spyglass',
    type: 'artifact',
    enabled: true,
    dropdownMenu: 'all',
    name: 'Thoreau’s Spyglass',
    location: "spyglass.html",
    src: "media/images/spyglass/spyglass.png",
    footerItem: false,
  },
  {
    id: 'lock-and-key',
    type: 'artifact',
    enabled: false,
    dropdownMenu: 'all',
    name: 'Lock and Key (Concord Jail)',
    location: "lock-and-key.html",
    src: "media/images/lock-and-key/lock-and-key.png"
  },
  {
    id: 'walking-stick',
    type: 'artifact',
    enabled: true,
    dropdownMenu: 'all',
    name: 'Thoreau’s Walking Stick',
    location: "walking-stick.html",
    src: "media/images/walking-stick/walking-stick.png",
    footerItem: false,
  },
  {
    id: 'flute',
    type: 'artifact',
    enabled: true,
    dropdownMenu: 'all',
    name: 'Thoreau’s Flute',
    location: "flute.html",
    src: "media/images/flute/flute.png",
    footerItem: false,
  },
  {
    id: 'desk',
    type: 'artifact',
    enabled: false,
    dropdownMenu: 'all',
    name: 'Thoreau’s Desk',
    location: "desk.html",
    src: "media/images/desk/desk.png",
    footerItem: false,
  },
  {
    id: 'main-menu',
    type: 'link',
    enabled: true,
    fragment: true,
    name: 'Main Menu',
    dropdownMenu: 'desktop',
    location: "index.html",
    footerItem: false,
  },
  {
    id: 'divider3',
    type: 'divider',
    dropdownMenu: 'mobile',
    footerItem: false,
  },
  {
    id: 'thoreau-collection',
    type: 'link',
    enabled: true,
    name: 'Thoreau Collection',
    dropdownMenu: 'mobile',
    location: "http://www.concordcollection.org/mExhibit.aspx?rID=Thoreau%20Collection&dir=PERMANENT",
    footerItem: true,
  },
  {
    id: 'educator-resources',
    type: 'link',
    enabled: true,
    name: 'Educator Resources',
    dropdownMenu: 'mobile',
    location: "https://concordmuseum.org/education/neh-landmarks-workshop/workshop-resources-from-2019/",
    footerItem: true,
  }
]
