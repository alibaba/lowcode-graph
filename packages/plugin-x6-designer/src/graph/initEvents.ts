import { rootState } from '../items/state';
import { project, Node as Model } from '@alilc/lowcode-engine';
import { FunctionExt, Graph, Node, Point, EdgeView, Edge, Cell } from '@antv/x6';
import { showPorts } from './util';
import { getNodeModel } from '../items/utils'

export const NormalStrokeColor = '#4C6079';
export const SelectedStrokeColor = '#027AFF'; // 选中边框色
export const SelectedFillColor = '#C6DEF8'; // 选中填充色
export const ErrorColor = '#ff5219'; // 红框错误

// 初始化画布事件
export function initEvents(graph: Graph) {
  graph.on('cell:click', ({ e, x, y, cell, view }) => {
    console.log('position:', x, y);
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
  
  graph.on('node:embedded', ({e, x, y, node, view, previousParent, currentParent}) => {
    if (node && currentParent) {
      const parentNodeModel = getNodeModel(currentParent.id);
      const nodeModel = getNodeModel(node.id);
      if (!parentNodeModel || !nodeModel) {
        return;
      }
      const isAdd = parentNodeModel?.children?.has(nodeModel);
      if (!isAdd) {
        parentNodeModel.children?.splice(0, 0, nodeModel);
      }
      if (!previousParent) {
        const removeIndex = project?.currentDocument?.root?.children.indexOf(nodeModel);
        if (removeIndex !== -1) {
          project?.currentDocument?.root?.children.splice(removeIndex, 1);
        }
      } else {
        const previousParentNodeModel = getNodeModel(previousParent.id);
        const removeIndex = previousParentNodeModel?.children.indexOf(nodeModel);
        if (removeIndex !== -1) {
          previousParentNodeModel.children?.splice(removeIndex, 1);
        }
      }
      // schema改变节点关系
      // 获取父节点resize属性
      const parentNodeResizeProp = currentParent?.store?.data?.data?.resize;
      if (typeof parentNodeResizeProp === 'function') {
        parentNodeResizeProp({x, y, node: currentParent});
      } else if (!!parentNodeResizeProp) {
        if (currentParent && currentParent.isNode()) {
          let originSize = currentParent.prop('originSize')
          if (originSize == null) {
            originSize = currentParent.getSize()
            currentParent.prop('originSize', originSize)
          }
      
          let originPosition = currentParent.prop('originPosition')
          if (originPosition == null) {
            originPosition = currentParent.getPosition()
            currentParent.prop('originPosition', originPosition)
          }
      
          let x = originPosition.x
          let y = originPosition.y
          let cornerX = originPosition.x + originSize.width
          let cornerY = originPosition.y + originSize.height
          let hasChange = false
      
          const children = currentParent.getChildren();
          if (children) {
            children.forEach((child) => {
              const bbox = child.getBBox();
              const corner = bbox.getCorner();
      
              if (bbox.x < x) {
                x = bbox.x
                hasChange = true
              }
      
              if (bbox.y < y) {
                y = bbox.y
                hasChange = true
              }
      
              if (corner.x > cornerX) {
                cornerX = corner.x
                hasChange = true
              }
      
              if (corner.y > cornerY) {
                cornerY = corner.y
                hasChange = true
              }
            })
          }
      
          if (hasChange) {
            currentParent.prop(
              {
                position: { x, y },
                size: { width: cornerX - x, height: cornerY - y },
              },
              { skipParentHandler: true },
            )
          }
        }
      }
      // 获取子节点的resize属性
      const nodeResizeProp = node?.store?.data?.data?.resize;
      if (typeof nodeResizeProp === 'function') {
        nodeResizeProp(x, y, node);
      }
      console.log('graph', currentParent, currentParent.getChildren());
    }
  })
  
  graph.on('node:change:position', ({ node, options }) => {
    if (options.skipParentHandler) {
      return
    }
  
    const children = node.getChildren()
    if (children && children.length) {
      node.prop('originPosition', node.getPosition())
    }
  
    const parent = node.getParent()
    if (parent && parent.isNode()) {
      let originSize = parent.getSize()
      let originPosition = parent.prop('originPosition')
      if (originPosition == null) {
        originPosition = parent.getPosition()
        parent.prop('originPosition', originPosition)
      }
  
      let x = originPosition.x
      let y = originPosition.y
      let cornerX = originPosition.x + originSize.width
      let cornerY = originPosition.y + originSize.height
      let hasChange = false
  
      const children = parent.getChildren()
      if (children) {
        children.forEach((child) => {
          const bbox = child.getBBox();
          const corner = bbox.getCorner();
  
          if (bbox.x < x) {
            x = bbox.x
            hasChange = true
          }
          if (bbox.y < y) {
            y = bbox.y
            hasChange = true
          }
          if (corner.x > cornerX) {
            cornerX = corner.x
            hasChange = true
          }
          if (corner.y > cornerY) {
            cornerY = corner.y
            hasChange = true
          }
        })
      }

      if (hasChange) {
        parent.prop(
          {
            position: { x, y },
          },
          { skipParentHandler: true },
        )
      }
    }
  })

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
