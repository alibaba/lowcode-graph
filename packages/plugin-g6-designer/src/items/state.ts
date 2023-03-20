import { observable, action, makeObservable } from "mobx";
import { DocumentModel } from '@alilc/lowcode-shell';
import { merge } from 'lodash';

export function transTree(node: any, callback: Function, parent?: any, depth = 0) {
  let flag = callback(node, parent, depth);
  if (flag != null) {
    return flag;
  } else {
    if (node.children && node.children.length) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        flag = flag || transTree(child, callback, node, depth + 1);
        if (flag != null) {
          return flag;
        }
      }
    }
  }
  return null;
}
export class RootState {
  @observable selected: string[] = []; // select 态，节点 蓝色背景 & 蓝色框
  @observable hovered: string = ''; // hover 态，节点蓝色框
  @observable error: string[] = []; // error 态，节点红框
  @observable nodes: any[] = []; // 单独存一份 nodes 状态数据
  document: DocumentModel | null;
  type: 'graph' | 'tree' = 'tree';

  documentEvent: (Function | void)[] = [];

  constructor() {
    makeObservable(this);
  }

  @action
  setNodes(nodes: any[]) {
    this.nodes = nodes;
  }

  getGraphData() {
    if (this.type === 'tree') {
      // 树布局
      const tree = this.document?.root?.exportSchema();
      const availableTree = Array.isArray(tree?.children) && tree?.children[0] || {};
      transTree(availableTree, (node: any) => {
        merge(node, node.props);
      });
      return availableTree;
    } else {
      // 图布局
    }
  }

  disposeDocumentEvent() {
    this.documentEvent.forEach(d => d && d());
    this.documentEvent = [];
  }

  init(document: DocumentModel | null, type: 'graph' | 'tree') {
    this.type = type;
    if (document) {
      this.document = document;
      this.setNodes(Array.from(document.nodesMap.values() || []).filter(node => node.componentName !== 'Page'));
      this.documentEvent = [
        document.onImportSchema(() => {
          this.setNodes(Array.from(document.nodesMap.values() || []).filter(node => node.componentName !== 'Page'));
        }),
        document.onMountNode((node: { node: Node }) => {
          this.setNodes(this.nodes.concat(node.node));
        }),
        document.onRemoveNode((node) => {
          const { prevSibling, nextSibling, parent } = node;
          const nodes = this.nodes.filter(v => v.id !== node.id);
          this.setNodes(nodes);
          // 支持连续删除节点
          setTimeout(() => {
            if (prevSibling) {
              this.setSelected([prevSibling.id]);
            } else if (nextSibling) {
              this.setSelected([nextSibling.id]);
            } else if (parent) {
              this.setSelected([parent.id]);
            }
          }, 100);
        }),
        document.onChangeNodeProp((data: any) => {
          const { node, key } = data;
          // 节点属性被更新时，判断时应用中间产物
          if (!['height', 'width', 'size', 'element'].includes(key)) {
            const { id } = node;
            this.nodes.map((item: any) => {
              if (item.id === id) {
                item.propsData.changeFlag = Math.random();
              }
              return item;
            });
          };
        }),
        // 撤销恢复不会触发 onAddNode 和 onRemoveNode 事件
        document.history.onChangeState((...data: any) => {
          this.setNodes(Array.from(document.nodesMap.values() || []).filter(node => node.componentName !== 'Page'));
        }),
      ];
    }
  }

  @action
  setSelected(ids: string[]) {
    this.selected = ids;
    this.document?.selection.selectAll(ids);
  }

  @action
  setHovered(id: string) {
    this.hovered = id;
    this.document?.detecting.capture(id);
  }

  @action
  setError(ids: string[]) {
    this.error = ids;
  }

}

export const rootState = new RootState();