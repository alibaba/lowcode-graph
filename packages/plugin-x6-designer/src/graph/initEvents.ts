import { rootState } from '../items/state';
import { project, Node as Model } from '@alilc/lowcode-engine';
import { FunctionExt, Graph, Node, Point, EdgeView, Edge, Cell } from '@antv/x6';
import { showPorts } from './util';

export const NormalStrokeColor = '#4C6079';
export const SelectedStrokeColor = '#027AFF'; // 选中边框色
export const SelectedFillColor = '#C6DEF8'; // 选中填充色
export const ErrorColor = '#ff5219'; // 红框错误

// 初始化画布事件
export function initEvents(graph: Graph) {
  graph.on('cell:click', ({ e, x, y, cell, view }) => {
    console.log('position:', x, y);
  });

  // 增加 node:added 事件，将 ports 数据更新到 schema 中，便于保存
  graph.on('node:added',({ node, index, options }) => {
    const nodeModel = project.currentDocument?.getNodeById(node.id) as Model;
    if (nodeModel) {
      nodeModel.setPropValue('ports', node.getPorts());
    }
  });

  graph.on('node:moved', ({ e, x, y, node, view }) => {
    const nodeModel = project.currentDocument?.getNodeById(node.id) as Model;
    if (nodeModel) {
      nodeModel.setPropValue('position', node.getPosition());
    }
  });

  graph.on('edge:mousemove', ({ x, y }) => {
    graph.panning.autoPanning(x, y);
  });


  graph.on('selection:changed', (args: {
    added: Cell[]     // 新增被选中的节点/边
    removed: Cell[]   // 被取消选中的节点/边
    selected: Cell[]  // 被选中的节点/边
  }) => {
    const { selected, removed, added } = args;
    const ids = selected.map(cell => cell.id);
    project.currentDocument?.selection.selectAll(ids);

    selected.forEach(cell => {
      if (cell.isEdge()) {
        cell.attr('line/stroke', SelectedStrokeColor);
      } else {
        cell.attr('body/strokeWidth', 1.5); // 边框变粗到 1.5
        cell.attr('body/stroke', SelectedStrokeColor); // 边框颜色

        const ports = cell.findView(graph)?.container.querySelectorAll('.x6-port-body') as NodeListOf<SVGAElement>;
        if (ports) {
          showPorts(ports, true);
        }
      }
    });

    removed.forEach(cell => {
      if (cell.isEdge()) {
        cell.attr('line/stroke', NormalStrokeColor);
        cell.toBack();
        cell.removeTool('target-arrowhead');
      } else {
        cell.attr('body/strokeWidth', 1);
        cell.attr('body/stroke', NormalStrokeColor);
        cell.toBack();
        const ports = cell.findView(graph)?.container.querySelectorAll('.x6-port-body') as NodeListOf<SVGAElement>;
        if (ports) {
          showPorts(ports, false);
        }
      }
    });
  });

  graph.on('cell:mouseenter', ({ cell }) => {
    cell.toFront();

    if (cell.isEdge()) {
      cell.attr('line/stroke', SelectedStrokeColor);
      cell.addTools([
        {
          name: 'target-arrowhead',
          args: {
            attrs: {
              'fill-opacity': 0,
              'stroke-opacity': 0,
            },
          },
        },
      ]);
    } else {
      cell.attr('body/strokeWidth', 1.5);
      cell.attr('body/stroke', SelectedStrokeColor);

      const ports = cell.findView(graph)?.container.querySelectorAll('.x6-port-body') as NodeListOf<SVGAElement>;
      cell.toFront();
      if (ports) {
        showPorts(ports, true);
      }
    }
  });

  graph.on('cell:mouseleave', ({ cell }) => {
    const selected = project.currentDocument?.selection.selected;
    if (selected?.includes(cell.id)) {
      return;
    }

    if (cell.isEdge()) {
      cell.attr('line/stroke', NormalStrokeColor);
      cell.toBack();
      cell.removeTool('target-arrowhead');
    } else {
      cell.attr('body/strokeWidth', 1);
      cell.attr('body/stroke', NormalStrokeColor);
      // this.node.attr('body/fill', '#fff');
      cell.toBack();
      const ports = cell.findView(graph)?.container.querySelectorAll('.x6-port-body') as NodeListOf<SVGAElement>;
      if (ports) {
        showPorts(ports, false);
      }
    }
  });
}
