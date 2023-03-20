import { ILowCodePluginContext } from '@alilc/lowcode-engine';
export const insertChild = (ctx: ILowCodePluginContext, graph: any, options: { selectedNodes: any, model: any }) => {
  const { model } = options;
  const node = ctx.project.currentDocument?.createNode(model)
  ctx.project.currentDocument?.insertNode(options.selectedNodes[0], node);
}

export const insertSibling = (ctx: ILowCodePluginContext, graph: any, options: { selectedNodes: any, model: any }) => {
  const { model } = options;
  const node = ctx.project.currentDocument?.createNode(model);
  const currentSelectedNode = options.selectedNodes[0];
  ctx.project.currentDocument?.insertNode(currentSelectedNode.parent, node, currentSelectedNode.index + 1);
}