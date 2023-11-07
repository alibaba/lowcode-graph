import { Graph, Shape } from '@antv/x6';
import { project, Node as Model } from '@alilc/lowcode-engine';
import { common } from '@alilc/lowcode-engine';
import { IPublicEnumTransitionType } from '@alilc/lowcode-types';

export function initGraph(container: HTMLElement, graphConfig: any = {}, designer: any) {
  //@ts-ignore
  const graph = new Graph({
    grid: {
      // 网格
      size: 10,
      visible: true,
      type: 'dot', // 'dot' | 'fixedDot' | 'mesh'
      args: {
        color: '#919BAE', // 网格线/点颜色
        thickness: 1, // 网格线宽度/网格点大小
      },
    },
    panning: {
      enabled: true,
      eventTypes: ['mouseWheel']
    },
    clipboard: false,
    snapline: true, // 对齐线
    // https://github.com/antvis/X6/pull/2342 多选移动会和 sanpline 计算冲突，x6 bug 暂时不支持多选移动
    selecting: {
      enabled: true,
      rubberband: true,
      modifiers: ['shift'],
    },
    connecting: {
      snap: {
        radius: 40, // 吸附阈值
      },
      allowBlank: false, // 不允许连接到画布空白位置的点
      allowLoop: false, // 不允许创建循环连线
      allowMulti: false, // 不允许在相同的起始节点和终止之间创建多条边
      allowNode: false,
      allowEdge: true,
      allowPort: true,
      highlight: true,
      createEdge() {
        // 创建新边
        return new Shape.Edge({
          attrs: {
            line: {
              strokeDasharray: '5 5',
              stroke: '#4C6079',
              strokeOpacity: 0.5,
              strokeWidth: 1,
              targetMarker: {
                // 箭头
                name: 'block',
                size: 8,
              },
            },
          },
          zIndex: 0,
        });
      },
      validateEdge({ edge }) {
        const doc = project.currentDocument!;
        const contentEdge = doc.getNodeById(edge.id);
        if (!contentEdge) {
          const node = doc.createNode({
            componentName: 'Line',
            title: '线',
            props: {
              name: '线',
              source: edge.getSourceCellId(),
              target: edge.getTargetCellId(),
              sourcePortId: edge.getSourcePortId(),
              targetPortId: edge.getTargetPortId()
            },
          });
          const rootNode = project.currentDocument?.root;
          project.currentDocument?.insertNode(rootNode!, node);
        } else {
          common.utils.executeTransaction(() => {
            contentEdge.setPropValue('source', edge.getSourceCellId());
            contentEdge.setPropValue('target', edge.getTargetCellId());
            contentEdge.setPropValue('sourcePortId', edge.getSourcePortId());
            contentEdge.setPropValue('targetPortId', edge.getTargetPortId());
          }, IPublicEnumTransitionType.REPAINT);
        }

        return false;
      },
    },
    ...graphConfig,
    onEdgeLabelRendered(args) {
      const onEdgeLabelRenderCb = designer.onEdgeLabelRender();
      for (const cb of onEdgeLabelRenderCb) {
        cb(args);
      }
    },
    container,
    // async: true, // 异步加载画布
  });

  // 适应画布
  const getContainerSize = () => {
    const leftPanel = document.querySelector('.lc-left-area')?.clientWidth || 0;
    const rightPanel =
      document.querySelector('.lc-right-area')?.clientWidth || 0;
    return {
      width: document.body.offsetWidth - leftPanel - rightPanel,
      height: document.querySelector('.lc-main-area')?.clientHeight || 0,
    };
  };
  const resizeFn = () => {
    const { width, height } = getContainerSize();
    graph.resize(width, height);
  };
  window.addEventListener('resize', resizeFn);

  // 画布内容居中
  requestAnimationFrame(() => {
    resizeFn();
    graph.centerContent();
  });
  return graph;
}
