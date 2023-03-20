import G6, { TreeGraph, Graph } from '@antv/g6';
import { material, ILowCodePluginContext } from '@alilc/lowcode-engine';
import { EditorCommand, CommandManager, ICommandCb } from '@alilc/lce-graph-tools';
import { zoomIn, zoomOut, removeItem, insertChild, insertSibling, undo, redo } from './builtin-commands';
import behaviors from './graph/behaviors';
import { MixedTreeLayout } from './graph/layouts';
import defaultShape from './graph/shapes/default-shape';

export class G6Designer {
  constructor() {
    this.commandManager = new CommandManager({
      [EditorCommand.ZoomIn]: zoomIn,
      [EditorCommand.ZoomOut]: zoomOut,
      [EditorCommand.removeItem]: removeItem,
      [EditorCommand.insertChildNode]: insertChild,
      [EditorCommand.insertSiblingNode]: insertSibling,
      [EditorCommand.Undo]: undo,
      [EditorCommand.Redo]: redo
    });
  }
  commandManager: CommandManager;
  templates: any = {};
  graphConfig: any = {};
  layoutConfig: any = {};
  doClip: boolean = true;
  graph: TreeGraph | Graph;
  ctx: ILowCodePluginContext;

  private _registerNode = (list: Array<{ name: string, config: any, extend?: any }>) => {
    list.forEach((nodeConfig: any) => {
      const { name, config, extend } = nodeConfig;
      G6.registerNode(name, config, extend);
    });
  }

  private _registerEdge(list: Array<{ name: string, config: any, extend?: any }>) {
    list.forEach((edgeConfig: any) => {
      const { name, config, extend } = edgeConfig;
      G6.registerEdge(name, config, extend);
    });
  }

  private _setItems() {
    const global: any = window;
    const assets = material.getAssets();
    const componentMetasMap = material.getComponentMetasMap();
    const temps: any = {};
    const edges: any[] = [];
    for (let meta of componentMetasMap) {
      const [key, componentMeta] = meta;
      if (!componentMeta || !componentMeta.npm) {
        console.error(`${key} is not a npm component`);
        return null;
      }
      const { package: componentPackage, destructuring, exportName } = componentMeta.npm;
      const library = assets.packages.find((item: any) => item.package === componentPackage).library;
      if (!library) {
        console.error(`${key} library is not defined`);
        return null;
      }
      if (destructuring && exportName) {
        if (componentMeta.getMetadata().tags?.includes('node')) {
          temps[exportName] = global[library][exportName];
        } else {
          edges.push(global[library][exportName]);
        }
      }
    }
    this._setTemplates(temps);
    this._registerEdge(edges);
    this._registerNode([defaultShape]);
  }

  private _setTemplates(temps: any) {
    this.templates = temps;
  }

  public registerBehavior = (list: Array<{ name: string, config: any }>) => {
    list.forEach((behaviorConfig: any) => {
      const { name, config } = behaviorConfig;
      G6.registerBehavior(name, config);
    });
  }

  public registerLayout = (list: Array<{ key: string, Cfg: any }>) => {
    list.forEach((layout: any) => {
      const { key, Cfg } = layout;
      MixedTreeLayout.registerLayoutMethod(key, Cfg);
    });
  }

  public registerCommand = (key: string, listener: ICommandCb) => {
    this.commandManager.register(key, listener);
  }

  public setGraphConfig = (data: any) => {
    this.graphConfig = data;
  }
  public setLayoutConfig = (data: any) => {
    this.layoutConfig = data;
  }
  public setDoClip = (data: boolean) => {
    this.doClip = data;
  }

  public init = (ctx: ILowCodePluginContext, graph: Graph | TreeGraph) => {
    this._setItems();
    this.ctx = ctx;
    this.graph = graph;
    this.commandManager.init(ctx, graph);
  }

  public setGraph(graph: Graph | TreeGraph) {
    this.graph = graph;
  }

  public getGraph(): Graph | TreeGraph {
    return this.graph;
  }
}
const g6Designer = new G6Designer();
// 默认行为
g6Designer.registerBehavior(behaviors);
export default g6Designer;