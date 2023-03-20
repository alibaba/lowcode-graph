import { createElement, PureComponent } from "react";
import { ILowCodePluginContext, project } from '@alilc/lowcode-engine';
import { Editor } from '@alilc/lowcode-editor-core';
import { initTreeGraph, initGraph } from "./graph/initGraph";
import Items from "./items";
import { render } from "react-dom";
import { CommandManager } from "@alilc/lce-graph-tools";
import { Graph, TreeGraph } from "@antv/g6";
import { rootState } from './items/state';
import g6Designer from "./designer";

interface IProps {
  editor: Editor;
  ctx: ILowCodePluginContext;
  commandManager: CommandManager;
  type: 'tree' | 'graph';
  graphConfig?: any;
  layoutConfig?: any;
}



export default class DesignerView extends PureComponent<IProps> {
  private container: HTMLDivElement;
  private nodesContainer: HTMLDivElement;

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  }

  refNodesContainer = (container: HTMLDivElement) => {
    this.nodesContainer = container;
  }

  componentDidMount() {
    g6Designer.setGraphConfig(this.props.graphConfig || {});
    g6Designer.setLayoutConfig(this.props.layoutConfig || {});

    // @ts-ignore
    let graph: Graph | TreeGraph | null = null;
    if (rootState.type === 'tree') {
      // 树布局
      graph = initTreeGraph(this.container, rootState.getGraphData.bind(rootState));
    } else {
      // 图布局
      graph = initGraph(this.container);
    }
    if (graph) {
      // g6Designer start
      g6Designer.init(this.props.ctx, graph);

      render(
        createElement(Items, {
          graph
        }),
        this.nodesContainer
      );
    }
  }

  render() {
    return (
      <div id="design-view" className="design-view" ref={this.refContainer}>
        <div id="design-view-nodes" ref={this.refNodesContainer}></div>
      </div>
    )
  }
}