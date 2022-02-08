const zoomMinus = document.getElementById('zoom-minus');
const zoomPlus = document.getElementById('zoom-plus');
const artifactImage = document.getElementById('artifact-image');

export const zoom = {
  scale: 1,
  maxScale: 3,
  increment: 1.1
}

zoomMinus.addEventListener('click', () => {
  zoom.scale /= zoom.increment;
  manageZoomButtons();
})

zoomPlus.addEventListener('click', () => {
  zoom.scale *= zoom.increment;
  manageZoomButtons();
})

const manageZoomButtons = () => {
  const rescaleArtifactImage = () => {
    artifactImage.style.transform = `scale(${zoom.scale})`;
  }

  if (zoom.scale > zoom.maxScale) {
    zoom.scale = zoom.maxScale;
    zoomPlus.setAttribute("disabled", "disabled");
  } else {
    zoomPlus.removeAttribute("disabled");
  }
  if (zoom.scale < 1) {
    zoom.scale = 1;
    zoomMinus.setAttribute("disabled", "disabled");
  } else {
    zoomMinus.removeAttribute("disabled");
  }
  rescaleArtifactImage();
}
