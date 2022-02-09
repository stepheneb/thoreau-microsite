import { app } from "./globals.js";

const zoomMinus = document.getElementById('zoom-minus');
const zoomPlus = document.getElementById('zoom-plus');
const artifactImage = document.getElementById('artifact-image');
const artifactWrapper = artifactImage.parentElement;
const dragLayer = artifactWrapper.querySelector('div.draglayer');

export const zoom = {
  scale: 1,
  maxScale: 3,
  increment: 1.1,
  dx: 0,
  dy: 0,
  startpos: {
    x: 0,
    y: 0
  },
  endpos: {
    x: 0,
    y: 0
  }
}

const scaleAndTranslate = () => {
  let transform = `scale(${zoom.scale}) translate(${zoom.dx}px, ${zoom.dy}px)`;
  artifactImage.style.transform = transform;
  if (zoom.scale > 1) {
    artifactWrapper.classList.add('zoomed');
  } else {
    artifactWrapper.classList.remove('zoomed');
  }
}

const handleZoomButtons = () => {
  if (zoom.scale > zoom.maxScale) {
    zoom.scale = zoom.maxScale;
    zoomPlus.setAttribute("disabled", "disabled");
  } else {
    zoomPlus.removeAttribute("disabled");
  }
  if (zoom.scale < 1) {
    zoom.scale = 1;
    zoom.dx = 0;
    zoom.dy = 0;
    zoomMinus.setAttribute("disabled", "disabled");
  } else {
    zoomMinus.removeAttribute("disabled");
  }
  scaleAndTranslate();
}

zoomMinus.addEventListener('click', () => {
  zoom.scale /= zoom.increment;
  handleZoomButtons();
})

zoomPlus.addEventListener('click', () => {
  zoom.scale *= zoom.increment;
  handleZoomButtons();
})

export const setupDragHandling = () => {
  let dragstarted = false;
  const originalPos = { x: 0, y: 0 };

  const dragEnded = () => {
    dragstarted = false;
    dragLayer.classList.remove('dragging');
  }

  const updateDxDy = () => {
    zoom.dx = originalPos.x + (zoom.endpos.x - zoom.startpos.x) / zoom.scale;
    zoom.dy = originalPos.y + (zoom.endpos.y - zoom.startpos.y) / zoom.scale;
    scaleAndTranslate();
  }

  dragLayer.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    dragLayer.classList.add('dragging');
    zoom.startpos.x = e.offsetX;
    zoom.startpos.y = e.offsetY;
    originalPos.x = zoom.dx;
    originalPos.y = zoom.dy;
    dragstarted = true;
  });

  dragLayer.addEventListener('pointermove', (e) => {
    if (dragstarted) {
      e.preventDefault();
      zoom.endpos.x = e.offsetX;
      zoom.endpos.y = e.offsetY;
      updateDxDy();
    }
  });

  dragLayer.addEventListener('pointerup', (e) => {
    e.preventDefault();
    dragEnded();
  });

  dragLayer.addEventListener('pointercancel', () => {
    dragEnded();
  });

  dragLayer.addEventListener('pointerleave', () => {
    dragEnded();
  });
}
