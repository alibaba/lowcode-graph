import { createElement, Fragment, PureComponent } from "react";
import { ILowCodePluginContext } from '@alilc/lowcode-engine';
import { Editor } from '@alilc/lowcode-editor-core';
import { initGraph } from "./graph/initGraph";
import Nodes from "./items";
import { render } from "react-dom";
import { registerShape } from "./graph/registerShape";
import { initEvents } from "./graph/initEvents";
import { x6Designer } from './designer';

interface IProps {
  editor: Editor;
  ctx: ILowCodePluginContext;
  graphConfig?: any;
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
    registerShape();

    // @ts-ignore
    const graph = initGraph(this.container, this.props.graphConfig);
    if (graph) {
      x6Designer.init(this.props.ctx, graph);
      initEvents(graph);

      // add nodes & edges
      render(
        createElement(Nodes, {
          graph,
          ctx: this.props.ctx,
        }),
        this.nodesContainer
      );

    }
  }

  render() {
    return (
      <div id="design-view" className="design-view" ref={this.refContainer} style={{ width: '100%' }}>
        <div id="design-view-nodes" ref={this.refNodesContainer}></div>
      </div>
    )
  }
}