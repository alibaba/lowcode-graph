import { ILowCodePluginContext } from '@alilc/lowcode-engine';
export const zoomIn = (ctx: ILowCodePluginContext, graph: any) => {
  graph.zoom(1.1);
}
export const zoomOut = (ctx: ILowCodePluginContext, graph: any) => {
  graph.zoom(0.9);
}