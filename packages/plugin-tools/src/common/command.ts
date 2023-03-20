import { ILowCodePluginContext } from '@alilc/lowcode-engine';
import { Graph, TreeGraph } from '@antv/g6';
import { Graph as X6Graph } from '@antv/x6';

export type IGraph = typeof Graph | typeof TreeGraph | typeof X6Graph;
export type ICommandCb = (ctx: ILowCodePluginContext, graph: IGraph, data: any) => void;

export interface ICommands {
  [key: string]: ICommandCb
}

export class CommandManager {
  constructor(data: ICommands) {
    this.commands = data;
  }

  ctx: ILowCodePluginContext;

  graph: IGraph;

  commands: ICommands = {};

  init(ctx: ILowCodePluginContext, graph: IGraph) {
    this.ctx = ctx;
    this.graph = graph;
    // TODO: 重复监听
    Object.keys(this.commands).forEach((key: string) => {
      ctx.event.on(`common:${key}`, (data: any) => {
        this.commands[key](ctx, graph, data);
      });
    });
  }

  register(key: string, listener: ICommandCb) {
    this.commands[key] = listener;
    if (this.ctx && this.graph) {
      this.ctx?.event.on(`common:${key}`, (data: any) => {
        listener(this.ctx, this.graph, data);
      });
    }
  }

  get(key: string) {
    return this.commands[key];
  }
}