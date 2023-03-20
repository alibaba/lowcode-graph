import { Behavior } from '../interfaces';

export interface DoubleFingerDragCanvas extends Behavior {
  onWheel(ev: any): void;
}

const doubleFingerDragCanvas: DoubleFingerDragCanvas = {
  getEvents() {
    return {
      wheel: 'onWheel'
    };
  },
  onWheel(ev) {
    if (ev.ctrlKey) {
      const canvas = this.graph!.get('canvas');
      const pixelRatio = canvas.get('pixelRatio') || 1;
      const point = canvas.getPointByClient(ev.clientX, ev.clientY);
      let ratio = this.graph!.getZoom();
      if (ev.wheelDelta > 0) {
        ratio += ratio * 0.05;
      } else {
        ratio -= ratio * 0.05;
      }
      this.graph!.zoomTo(ratio, {
        x: point.x / pixelRatio,
        y: point.y / pixelRatio,
      });
    } else {
      const x = ev.deltaX || ev.movementX;
      const y = ev.deltaY || ev.movementY;
      this.graph!.translate(-x, -y);
    }
    ev.preventDefault();
  }
};

export default {
  config: doubleFingerDragCanvas,
  name: 'double-finger-drag-canvas'
}
