import { Graph, TreeGraph, ModelConfig } from '@antv/g6';
import React from 'react';
import { Node as LceNode } from '@alilc/lowcode-engine';
import { ItemState } from '@alilc/lce-graph-tools';
import { calcLayout } from '../../graph/utils';

export interface IModelConfig extends ModelConfig {
  id: string;
  [key: string]: any;
}

interface Props {
  onMountNode: (node: any) => void;
  onUnMountNode: (nodeId: string) => void;

  graph: Graph | TreeGraph;
  lceNode: LceNode;

  selected: boolean;
  hovered: boolean;
  error: boolean;
  changeFlag: number | undefined;
}

/**
 * node component for x6 node render
 */
class NodeComponent extends React.PureComponent<Props> {
  componentDidMount() {
    // 添加节点
    const { lceNode, selected, hovered, error } = this.props;
    // 计算element canvas定位
    const node = calcLayout(lceNode, selected, hovered, error);
    if (node) {
      const { width, height } = node.box;
      lceNode.setPropValue('height', height);
      lceNode.setPropValue('width', width);
      lceNode.setPropValue('size', [width, height]);
    }
    // 注册节点config
    this.props.onMountNode(lceNode);
  }

  componentDidUpdate(prevProps: Props) {
    const { changeFlag, selected, hovered, error } = this.props;
    if (prevProps.changeFlag !== changeFlag || selected !== prevProps.selected || hovered !== prevProps.hovered || error !== prevProps.error) {
      this.updateNode();
    }
    if (selected !== prevProps.selected || hovered !== prevProps.hovered || error !== prevProps.error) {
      this.setNodeState();
    }
  }

  updateNode() {
    const { lceNode, graph, selected, hovered, error } = this.props;
    const nodeLayout = calcLayout(lceNode, selected, hovered, error);
    if (nodeLayout) {
      const oldWidth = lceNode.getPropValue('width');
      const oldHeight = lceNode.getPropValue('height');
      const { width, height } = nodeLayout.box;
      lceNode.setPropValue('height', height);
      lceNode.setPropValue('width', width);
      lceNode.setPropValue('size', [width, height]);
      graph.updateItem(lceNode.id, {
        ...lceNode.propsData,
        height,
        width,
        size: [width, height],
      });
      if (Math.abs(+oldWidth - +width) > 1 || Math.abs(+oldHeight - +height) > 1) {
        graph.layout();
      }
    } else {
      graph.updateItem(lceNode.id, {
        ...lceNode.propsData
      });
      graph.layout();
    }
  }

  setNodeState() {
    const { lceNode, graph, selected, hovered, error } = this.props;
    const currentNode = graph.findById(lceNode.id);
    graph!.setItemState(currentNode, ItemState.Selected, selected);
    graph!.setItemState(currentNode, ItemState.Active, hovered);
  }

  componentWillUnmount() {
    // 删除节点
    const { lceNode } = this.props;
    this.props.onUnMountNode(lceNode.id);
  }

  render() {
    return null;
  }
}

export default NodeComponent;

