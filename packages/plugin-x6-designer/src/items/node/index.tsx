import { Graph, Node } from '@antv/x6';
import React from 'react';
import { Node as NodeModel } from '@alilc/lowcode-shell';
import { x6Designer as designer } from '../../designer';
import { getComponentView, updateNodeProps } from '../utils';

interface Props {
  onMountNode: (node: Node) => void;
  onUnMountNode: (node: Node) => void;

  graph: typeof Graph;
  model: NodeModel;
  ctx: any;
}



/**
 * node component for x6 node render
 */
class NodeComponent extends React.PureComponent<Props> {
  private node: Node;
  // 节点区分是否有自定义html渲染
  private nodeDefinedType: 'shape' | 'component';

  componentDidMount() {
    // 添加节点
    const { model, graph, ctx } = this.props;
    const { project } = ctx;
    const view = getComponentView(model);
    this.nodeDefinedType = view?.component ? 'component' : 'shape';
    this.node = graph.createNode({
      id: model.id,
      ...view
    });

    // 收集 node 统一添加到画布
    this.props.onMountNode(this.node);

    // @ts-ignore
    const { position } = model.propsData;
    // 定位
    this.node.setPosition(position);
    // 加载自定义节点渲染逻辑
    const onNodeRenderCb = designer.onNodeRender();

    debugger
    // 用户自定义渲染逻辑切面
    if (onNodeRenderCb && onNodeRenderCb.length > 0) {
      for (const cb of onNodeRenderCb) {
        cb(model, this.node);
      }
    }
    if (this.nodeDefinedType === 'component') {
      updateNodeProps(model, this.node);
    }

    // model 更新触发渲染
    project.currentDocument?.onChangeNodeProp(({ key, oldValue, newValue, node }) => {
      debugger
      if (node.id !== model.id) {
        return;
      }

      if (key === 'position') {
        this.node.setPosition(newValue);
        return;
      }

      // 用户自定义渲染逻辑切面
      if (onNodeRenderCb && onNodeRenderCb.length > 0) {
        for (const cb of onNodeRenderCb) {
          cb(model, this.node);
        }
      }
      if (this.nodeDefinedType === 'component') {
        this.node.prop(key, newValue);
      }
    });
  }

  componentWillUnmount() {
    // 删除节点
    this.props.onUnMountNode(this.node);
  }

  render() {
    return null;
  }
}

export default NodeComponent;

