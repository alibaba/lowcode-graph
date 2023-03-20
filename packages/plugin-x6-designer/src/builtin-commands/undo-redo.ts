import { IPublicModelPluginContext } from '@alilc/lowcode-types';
export const undo = (ctx: IPublicModelPluginContext, graph: any) => {
  ctx.project.currentDocument?.history.back();
}
export const redo = (ctx: IPublicModelPluginContext, graph: any) => {
  ctx.project.currentDocument?.history.forward();
}