import { observable, action, makeObservable } from "mobx";
import { IPublicModelDocumentModel } from '@alilc/lowcode-types';

export const EdgeComponentName = 'Line'; // 边 组件独一 componentName


export class RootState {
  @observable.shallow private nodes: any[] = []; // 单独存一份 nodes 状态数据

  documentEvent: Function[] = [];

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

  disposeDocumentEvent() {
    this.documentEvent.forEach(d => d && d());
    this.documentEvent = [];
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
        // 撤销恢复不会触发 onAddNode 和 onRemoveNode 事件
        document.history.onChangeState((...data: any) => {
          this.nodes = Array.from(document.nodesMap.values() || []);
        }),
      ];
    }
  }
}

export const rootState = new RootState();