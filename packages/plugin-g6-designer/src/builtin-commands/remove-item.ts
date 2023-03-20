import { ILowCodePluginContext } from '@alilc/lowcode-engine';
export const removeItem = (ctx: ILowCodePluginContext, graph: any, selectedNodes: any[]) => {
  selectedNodes?.forEach(node => { ctx.project.currentDocument?.removeNode(node.id) });
}