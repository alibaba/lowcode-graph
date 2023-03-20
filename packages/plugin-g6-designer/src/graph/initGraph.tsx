import G6, { GraphOptions } from '@antv/g6';
import { MixedTreeLayout } from './layouts';
import g6Designer from '../designer';
import { get } from 'lodash';

export const initTreeGraph = (container: HTMLElement, graphData: Function) => {
  // 适应画布
  const getContainerSize = () => {
    const leftPanel = document.querySelector('.lc-left-area')?.clientWidth || 0;
    const rightPanel = document.querySelector('.lc-right-area')?.clientWidth || 0;
    return {
      width: document.body.offsetWidth - leftPanel - rightPanel,
      height: (document.querySelector('.lc-main-area')?.clientHeight || 0),
    };
  };
  const treeLayout = new MixedTreeLayout(g6Designer.layoutConfig);

  // @ts-ignore
  const defaultOption = {
    container,
    fitCenter: true,
    fitView: true,
    linkCenter: true,
    animate: false,
    groupByTypes: true,
    modes: {
      default: [
        'drag-canvas',
        'click',
        'click-item',
        'hover-item',
        'double-finger-drag-canvas',
        {
          type: 'collapse-expand',
          trigger: 'click',
          shouldBegin: (e) => {
            const eleName = get(e, 'target.attrs.name');
            if (eleName === 'collapse') return true;
            return false;
          },
        },
      ],
    },
    defaultEdge: {
      type: 'trident',
    },
    defaultNode: {
      type: 'demo-shape'
    },
    layout: (data: any) => {
      const layoutData = treeLayout.layout(data);
      return layoutData;
    },
    width: getContainerSize().width || 500,
    height: getContainerSize().height || 500,
  } as GraphOptions;

  const treeGraph = new G6.TreeGraph({
    ...defaultOption,
    ...g6Designer.graphConfig
  });
  return treeGraph;
}

export const initGraph = (container: HTMLElement) => {
  // 适应画布
  const getContainerSize = () => {
    const leftPanel = document.querySelector('.lc-left-area')?.clientWidth || 0;
    const rightPanel = document.querySelector('.lc-right-area')?.clientWidth || 0;
    return {
      width: document.body.offsetWidth - leftPanel - rightPanel,
      height: document.querySelector('.lc-main-area')?.clientHeight || 0,
    };
  };
  const defaultOption = {
    container,
    fitCenter: true,
    linkCenter: true,
    animate: false,
    groupByTypes: true,
    modes: {
      default: [
        'drag-canvas',
        'click',
        'click-item',
        'hover-item',
        'double-finger-drag-canvas',
        // 'collapse-expand'
      ],
    },
    defaultEdge: {
      type: 'trident',
    },
    defaultNode: {
      type: 'demo-shape'
    },
    width: getContainerSize().width || 500,
    height: getContainerSize().height || 500,
  } as GraphOptions;

  const graph = new G6.Graph({
    ...defaultOption,
    ...g6Designer.graphConfig
  });

  return graph;
}