import { Graph, Edge } from '@antv/x6';
import React from 'react';
import { Node as NodeModel } from '@alilc/lowcode-shell';
import { getComponentView, updateNodeProps } from '../utils';
import designer from '../../designer';

interface Props {
  onMountEdge: (edge: Edge) => void;
  onUnMountEdge: (edge: Edge) => void;

  graph: Graph;
  model: NodeModel;
  ctx: any;
}

/**
 * edge component for x6 edge render
 */
class EdgeComponent extends React.PureComponent<Props> {
  private edge: Edge;

  componentDidMount() {
    const { model, graph, ctx } = this.props;
    const { project } = ctx;

    // 创建 edge
    const view = getComponentView(model);
    this.edge = graph.createEdge({
      id: model.id,
      ...view
    });

    // 收集 edge 统一添加到画布
    this.props.onMountEdge(this.edge);

    // set edge vertices
    // @ts-ignore
    const { source, target } = model.propsData;

    // set source & target
    this.edge.setSource({ cell: source });
    this.edge.setTarget({ cell: target });

    // 渲染逻辑切面
    const onEdgeRender = designer.onEdgeRender();
    // 渲染逻辑切面
    for (const cb of onEdgeRender) {
      cb(model, this.edge);
    }

    // model 更新渲染
    project.currentDocument?.onChangeNodeProp(({ key, oldValue, newValue, node }) => {
      if (node.id !== model.id) {
        return;
      }

      if (key === 'source') {
        this.edge.setSource({ cell: newValue });
      }

      if (key === 'target') {
        this.edge.setTarget({ cell: newValue });
      }

      // 用户自定义渲染逻辑切面
      for (const cb of onEdgeRender) {
        cb(model, this.edge);
      }
    });
  }

  componentWillUnmount() {
    // 删除节点
    this.props.onUnMountEdge(this.edge);
  }

  render() {
    return null;
  }
}

export default EdgeComponent;

