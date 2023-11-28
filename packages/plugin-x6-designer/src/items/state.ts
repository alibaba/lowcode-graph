import { observable, action, makeObservable } from "mobx";
import { Graph, Node, Edge } from '@antv/x6';
import { IPublicModelDocumentModel } from '@alilc/lowcode-types';
import { getComponentView, updateNodeProps } from './utils';
import { Designer } from "../designer";

export const EdgeComponentName = 'Line'; // 边 组件独一 componentName


export class RootState {
  @observable.shallow private nodes: any[] = []; // 单独存一份 nodes 状态数据

  documentEvent: Function[] = [];
  graph: Graph;
  designer: Designer;
  autoRepaintNode: boolean = true;

  constructor() {
    makeObservable(this);
  }

  @action
  setNodes(nodes: any[]) {
    this.nodes = nodes;
  }

  getNodes() {
    return this.nodes;
  }

  setGraph(graph: Graph) {
    this.graph = graph;
  }

  getGraph() {
    return this.graph;
  }

  setDesigner(designer: Designer) {
    this.designer = designer;
  }

  getDesigner() {
    return this.designer;
  }

  disposeDocumentEvent() {
    this.documentEvent.forEach(d => d && d());
    this.documentEvent = [];
  }

  stopAutoRepaintNode() {
    this.autoRepaintNode = false;
  }

  enableAutoRepaintNode() {
    this.autoRepaintNode = true;
  }

  bindNodes(document: IPublicModelDocumentModel | null) {
    if (document) {
      this.nodes = Array.from(document.nodesMap.values() || []);
      this.documentEvent = [
        document.onImportSchema(() => {
          this.setNodes(Array.from(document.nodesMap.values() || []));
        }),
        document.onAddNode((node) => {
          this.nodes.push(node);
          this.setNodes(this.nodes);
        }),
        document.onRemoveNode((node) => {
          const _nodes = this.nodes.filter(v => v.id !== node.id);
          this.setNodes(_nodes);
        }),
        document.onChangeNodeProp((data: any) => {
          const { node, key, newValue } = data;
          const graphNode = this.graph.getCellById(node.id);
          if (!this.autoRepaintNode || !graphNode) {
            return;
          }
          if (node.componentMeta?.getMetadata().tags?.includes('edge')) {
            if (key === 'source') {
              (graphNode as Edge).setSource({ cell: newValue });
            }
            if (key === 'target') {
              (graphNode as Edge).setTarget({ cell: newValue });
            }
            const onEdgeRenderCb = this.designer.onEdgeRender();
            // 用户自定义渲染逻辑切面
            for (const cb of onEdgeRenderCb) {
              cb(node, graphNode as Edge);
            }
          } 
          // 节点的更新
          else {
            if (key === 'position') {
              (graphNode as Node).setPosition(newValue);
              return;
            }
            const onNodeRenderCb = this.designer.onNodeRender();
            // 用户自定义渲染逻辑切面
            if (onNodeRenderCb && onNodeRenderCb.length > 0) {
              for (const cb of onNodeRenderCb) {
                cb(node, graphNode as Node);
              }
            }
            const view = getComponentView(node);
            if (view?.component) {
              graphNode.prop(key, newValue);
            }
          }
        }),
        // 撤销恢复不会触发 onAddNode 和 onRemoveNode 事件
        document.history.onChangeState((...data: any) => {
          this.nodes = Array.from(document.nodesMap.values() || []);
        }),
      ];
    }
  }
}