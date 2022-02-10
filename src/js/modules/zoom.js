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
  app.logger(transform);
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
  const touchscreen = navigator.maxTouchPoints > 0 || navigator.platform == 'iPhone'
  const originalPos = { x: 0, y: 0 };

  const dragEnded = (e) => {
    e.preventDefault();
    dragstarted = false;
    dragLayer.classList.remove('dragging');
    console.log(e);
  }

  const updateDxDy = () => {
    zoom.dx = originalPos.x + (zoom.endpos.x - zoom.startpos.x) / zoom.scale;
    zoom.dy = originalPos.y + (zoom.endpos.y - zoom.startpos.y) / zoom.scale;
    scaleAndTranslate();
  }

  const down = (x, y) => {
    dragLayer.classList.add('dragging');
    dragstarted = true;
    zoom.startpos.x = x;
    zoom.startpos.y = y;
    originalPos.x = zoom.dx;
    originalPos.y = zoom.dy;
  }

  const move = (x, y) => {
    if (dragstarted) {
      zoom.endpos.x = x;
      zoom.endpos.y = y;
      updateDxDy();
    }
  }

  //
  // start
  //

  if (touchscreen) {
    dragLayer.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let touch = e.targetTouches[0];
      down(touch.clientX, touch.clientY);
    });
  }
  dragLayer.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    down(e.offsetX, e.offsetY);
  });

  //
  // move
  //
  if (touchscreen) {
    dragLayer.addEventListener('touchmove', (e) => {
      if (dragstarted) {
        e.preventDefault();
        e.stopPropagation();
        let touch = e.targetTouches[0];
        move(touch.clientX, touch.clientY);
      }
    });
  }
  dragLayer.addEventListener('pointermove', (e) => {
    if (dragstarted) {
      e.preventDefault();
      e.stopPropagation();
      move(e.offsetX, e.offsetY);
    }
  });

  //
  // end
  //

  dragLayer.addEventListener('pointerup', (e) => {
    dragEnded(e);
  });

  dragLayer.addEventListener('touchend', (e) => {
    dragEnded(e);
  });

  dragLayer.addEventListener('pointercancel', () => {
    // dragEnded();
  });

  dragLayer.addEventListener('touchcancel', () => {
    // dragEnded();
  });

  dragLayer.addEventListener('pointerleave', () => {
    // dragEnded();
  });

}
