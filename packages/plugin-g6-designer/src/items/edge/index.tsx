import React from 'react';
import { Graph, TreeGraph, ModelConfig } from '@antv/g6';
import { project } from '@alilc/lowcode-engine';
import { Node } from '@alilc/lowcode-engine';
export interface IModelConfig extends ModelConfig {
  id: string;
  [key: string]: any;
}
interface Props {
  onMountEdge: (edge: Node) => void;
  onUnMountEdge: (edge: any) => void;

  graph: Graph | TreeGraph;
  lceNode: Node;
}

class EdgeComponent extends React.PureComponent<Props> {

  componentDidMount() {
    const { lceNode } = this.props;

    // 收集 edge 统一添加到画布
    this.props.onMountEdge(lceNode);

    // set view state
    this.setViewState();

    // model 更新渲染
    project.currentDocument?.onChangeNodeProp(({ key, oldValue, newValue, node }) => {

    });
  }

  componentDidUpdate(prevProps: Props) {
  }

  setViewState() {
  }

  componentWillUnmount() {
    // 删除节点
    this.props.onUnMountEdge(this.props.lceNode.propsData);
  }

  render() {
    return null;
  }

}

export default EdgeComponent;

