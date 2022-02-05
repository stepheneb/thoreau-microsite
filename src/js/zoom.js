let zoomMinus, zoomPlus, artifactImage;

let artifactImageScale = 1;
let artifactMaxImageScale = 3;
let artifactZoomIncrement = 1.1;

zoomMinus = document.getElementById('zoom-minus');
zoomPlus = document.getElementById('zoom-plus');
artifactImage = document.getElementById('artifact-image');

zoomMinus.addEventListener('click', () => {
  artifactImageScale /= artifactZoomIncrement;
  manageZoomButtons();
})

zoomPlus.addEventListener('click', () => {
  artifactImageScale *= artifactZoomIncrement;
  manageZoomButtons();
})

let rescaleArtifactImage = () => {
  artifactImage.style.transform = `scale(${artifactImageScale})`;
}

let manageZoomButtons = () => {
  if (artifactImageScale > artifactMaxImageScale) {
    artifactImageScale = artifactMaxImageScale;
    zoomPlus.setAttribute("disabled", "disabled");
  } else {
    zoomPlus.removeAttribute("disabled");
  }
  if (artifactImageScale < 1) {
    artifactImageScale = 1;
    zoomMinus.setAttribute("disabled", "disabled");
  } else {
    zoomMinus.removeAttribute("disabled");
  }
  rescaleArtifactImage();
}
