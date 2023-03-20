// render to g6 node
import layoutShape from '../layout';
import renderShape from '../render';
import { createRenderer } from './renderer';
import diff from '../diff';
import patch from '../diff/patches';
export class GRenderer {

  constructor(element: any, renderer?: any, callback?: any) {
    this.element = element;
    this.renderer = renderer;
    this.callback = callback;
  }

  element: any = null;
  renderer: any = null;
  callback: any = null;
  layout: any = null;
  newLayout: any = null;

  calculateLayout() {
    const container = { type: 'ROOT', shape: null };

    let renderer = this.renderer || createRenderer({ onChange: this.callback ? this.callback : () => { } });

    const newRoot = renderer.createContainer(container);

    const updateContainer = element => {
      renderer.updateContainer(element, newRoot, null);
    };

    if (this.element) updateContainer(this.element);
    // cache layout
    this.layout = layoutShape(container.shape);
    return this.layout;
  }

  reCalculateLayout(element: any) {
    this.element = element;
    const container = { type: 'ROOT', shape: null };

    let renderer = this.renderer || createRenderer({ onChange: this.callback ? this.callback : () => { } });

    const newRoot = renderer.createContainer(container);

    const updateContainer = (element: any) => {
      renderer.updateContainer(element, newRoot, null);
    };

    if (this.element) updateContainer(this.element);
    // cache layout
    this.newLayout = layoutShape(container.shape);
    return this.newLayout;
  }

  render(gGroupContainer: any, layoutInfo: any) {
    const layout = layoutInfo || this.layout || this.calculateLayout();

    return renderShape(gGroupContainer, layout);
  }

  update(gGroupContainer: any, layoutInfo: any, element: any) {
    // 更新节点  兜底第一次渲染
    const layout = layoutInfo || this.newLayout || this.reCalculateLayout(element) || this.layout || this.calculateLayout();
    const patches = diff(this.layout, this.newLayout);
    patch(this.layout, patches, gGroupContainer);
    // 更新完节点把最新layout覆盖老layout
    this.layout = this.newLayout;

    // const shape = gGroupContainer.findAll(
    //   (allItem: any) => allItem.attr('name') && allItem.attr('name').indexOf('g-react') > -1,
    // );
    // shape.forEach((shapeItem: any) => {
    //   shapeItem.remove();
    // });
    // return renderShape(gGroupContainer, layout);
  }
}
