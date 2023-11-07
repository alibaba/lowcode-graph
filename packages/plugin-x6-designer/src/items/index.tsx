import React from 'react';
import { observer } from 'mobx-react';
import NodeComponent from './node';
import EdgeComponent from './edge';
import { Node, Edge, Graph } from '@antv/x6';
import { RootState } from "./state";
import { Designer } from '../designer';
import './index.less';

interface Props {
  graph: Graph;
  designer: Designer;
  ctx: any,
  rootState: RootState;
}

/**
 * render node & edge model
 * observable nodes
 */
@observer
class Nodes extends React.PureComponent<Props> {
  nodes: Node[] = [];
  edges: Edge[] = [];
  mounted: boolean = false; // 是否 didMounted

  componentDidMount() {
    const { graph } = this.props;
    graph.resetCells([...this.nodes, ...this.edges]);
    this.mounted = true;
  }

  onMountEdge = (edge: Edge) => {
    const { graph } = this.props;
    this.edges.push(edge);

    if (this.mounted) {
      graph.addEdge(edge);
    }
  }

  onMountNode = (node: Node) => {
    const { graph } = this.props;
    this.nodes.push(node);

    if (this.mounted) {
      graph.addNode(node);
    }
  }

  onUnMountNode = (node: Node) => {
    const { graph } = this.props;
    const index = this.nodes.indexOf(node);
    this.nodes.splice(index, 1);

    if (this.mounted) {
      graph.removeCell(node);
    }
  }

  onUnMountEdge = (edge: Edge) => {
    const { graph } = this.props;
    const index = this.edges.indexOf(edge);
    this.edges.splice(index, 1);

    if (this.mounted) {
      graph.removeCell(edge);
    }
  }

  render() {
    const { graph, designer, rootState, ctx } = this.props;
    const nodes = rootState.getNodes();
    const items = nodes.filter(v => typeof v.isPage === 'function' ? !v.isPage() : !v.isPage);
    return (
      <div className="editor-graph">
        {
          items.map(node => {
            if (node.componentMeta?.getMetadata().tags?.includes('edge')) {
              return (
                <EdgeComponent
                  key={node.id}
                  onMountEdge={this.onMountEdge}
                  onUnMountEdge={this.onUnMountEdge}
                  model={node}
                  graph={graph}
                  ctx={ctx}
                  designer={designer}
                />
              )
            } else {
              return (
                <NodeComponent
                  key={node.id}
                  onMountNode={this.onMountNode}
                  onUnMountNode={this.onUnMountNode}
                  model={node}
                  graph={graph}
                  ctx={ctx}
                  designer={designer}
                />)
            }
          })
        }
      </div>
    )
  }
}

export default Nodes;
