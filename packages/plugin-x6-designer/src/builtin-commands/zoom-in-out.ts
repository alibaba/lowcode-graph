import { IPublicModelPluginContext } from '@alilc/lowcode-types';
export const zoomIn = (ctx: IPublicModelPluginContext, graph: any) => {
  graph.zoom(0.1);
}
export const zoomOut = (ctx: IPublicModelPluginContext, graph: any) => {
  graph.zoom(-0.1);
}