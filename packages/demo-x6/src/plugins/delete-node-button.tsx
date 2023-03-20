import * as React from 'react';
import { hotkey, project, Node } from '@alilc/lowcode-engine';
import { isFormEvent } from '@alilc/lowcode-utils';
import { IDesigner } from '@alilc/lce-graph-x6-designer';

interface IProps {
  x6Designer: IDesigner
}

export default class DeleteNode extends React.Component<IProps> {
  onDelete = (e: any) => {
    if (isFormEvent(e)) return;
    const selectedNodes = project.currentDocument?.selection.getNodes();
    if (selectedNodes?.length) {
      selectedNodes.forEach(node => {
        // 可被删除判断
        if (node?.componentMeta?.getMetadata().tags?.includes('node')) {
          const allNodes = Array.from(project.currentDocument?.nodesMap.values() || []);
          // 相关线
          const lines = allNodes.filter(n => (n?.componentMeta?.getMetadata().tags?.includes('edge') && (n.getPropValue('source') === node.id || n.getPropValue('target') === node.id)));
          lines.forEach(line => {
            project.currentDocument?.removeNode(line.id);
          });
        }
        project.currentDocument?.removeNode(node.id);
      });
    }
  }

  componentDidMount() {
    // 覆盖原有删除
    hotkey.bind(['backspace', 'del'], (e) => {
      this.onDelete(e);
    });
  }

  render() {
    return <div onClick={this.onDelete}>删除</div>
  }
}