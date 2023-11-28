import { createElement, Fragment, PureComponent } from "react";
import { ILowCodePluginContext } from '@alilc/lowcode-engine';
import { Editor } from '@alilc/lowcode-editor-core';
import { initGraph } from "./graph/initGraph";
import Nodes from "./items";
import { render } from "react-dom";
import { registerShape } from "./graph/registerShape";
import { initEvents } from "./graph/initEvents";
import { Designer } from './designer';
import { RootState } from "./items/state";

interface IProps {
  editor: Editor;
  ctx: ILowCodePluginContext;
  graphConfig?: any;
  designer?: Designer;
  rootState?: RootState
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
    const designer = this.props.designer as Designer;
    const rootState = this.props.rootState as RootState;
    rootState.setDesigner(designer);
    // @ts-ignore
    const graph = initGraph(this.container, this.props.graphConfig, this.props.designer);
    if (graph) {
      designer.init(this.props.ctx, graph);
      initEvents(graph);
      rootState.setGraph(graph);
      // add nodes & edges
      render(
        createElement(Nodes, {
          graph,
          ctx: this.props.ctx,
          designer,
          rootState
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