import React from 'react';
import { observer } from 'mobx-react';
import NodeComponent, { IModelConfig } from './node';
import EdgeComponent from './edge';
import { Graph, TreeGraph } from '@antv/g6';
import { EdgeComponentName, rootState, transTree } from "./state";
import { Node } from '@alilc/lowcode-engine';
import { merge } from 'lodash';

import './index.less';



interface Props {
  graph: Graph | TreeGraph;
}

/**
 * 渲染节点 & 线条组件
 * 响应数据： nodes
 */
@observer
class Items extends React.PureComponent<Props> {
  constructor(props: any) {
    super(props);
    (window as any).gRendererMaps = {};
  }

  tree: any = {};
  mounted: boolean = false; // 是否 didMounted

  componentDidMount() {
    const { graph } = this.props;
    const data = rootState.getGraphData();
    graph.data(data);
    graph.paint();
    graph.render();
    graph.fitView();
    this.mounted = true;
  }

  onMountNode = (node: Node) => {
    const { graph } = this.props;
    if (this.mounted) {
      if (rootState.type === 'tree') {
        const t: any = node.parent!.schema.children;
        const newChildren = t.map((i: any) => {
          transTree(i, (j: any) => {
            merge(j, j.props);
          });
          return i;
        });
        (graph as TreeGraph).updateChildren(newChildren, node.parent!.id);
        // (graph as TreeGraph).addChild(merge(node.propsData, node.propsData!.nodeLayout, { id: node.id }), node.parent!.id);
        rootState.setSelected([node.id]);
      }
    }
  }

  onUnMountNode = (nodeId: string) => {
    const { graph } = this.props;
    if (this.mounted) {
      if (rootState.type === 'tree') {
        (graph as TreeGraph).removeChild(nodeId);
      }
    }
  }

  onMountEdge = (edge: Node) => {
    const { graph } = this.props;
    if (this.mounted) {
      graph.addItem('edge', edge.propsData);
    }
  }

  onUnMountEdge = (edge: IModelConfig) => {
    const { graph } = this.props;

    if (this.mounted) {
      graph.removeItem(edge.id);
    }
  }

  render() {
    const { graph } = this.props;
    return (
      <div className="editor-graph">
        {
          rootState.nodes.map(item => {
            const curId = item.id;
            if (item.componentName === EdgeComponentName) {
              return (
                <EdgeComponent
                  key={item.id}
                  onMountEdge={this.onMountEdge}
                  onUnMountEdge={this.onUnMountEdge}
                  lceNode={item}
                  graph={graph}
                />
              )
            } else {
              return (
                <NodeComponent
                  key={item.id}
                  onMountNode={this.onMountNode}
                  onUnMountNode={this.onUnMountNode}
                  lceNode={item}
                  graph={graph}
                  selected={rootState.selected?.includes(curId)}
                  hovered={rootState.hovered === curId}
                  error={rootState.error?.includes(curId)}
                  changeFlag={item.propsData.changeFlag}
                />)
            }
          })
        }
        {/* <DevTools /> */}
      </div>
    )
  }
}

export default Items;
