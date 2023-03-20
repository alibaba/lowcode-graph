import { IPublicModelPluginContext } from '@alilc/lowcode-types';
export const removeItem = (ctx: IPublicModelPluginContext, graph: any, selectedNodes: any[]) => {
  if (selectedNodes?.length) {
    selectedNodes.forEach(node => {
      // 可被删除判断
      if (node?.componentMeta?.getMetadata().tags?.includes('node')) {
        const allNodes = Array.from(ctx.project.currentDocument?.nodesMap.values() || []);
        // 相关线
        const lines = allNodes.filter(n => (n?.componentMeta?.getMetadata().tags?.includes('edge') && (n.getPropValue('source') === node.id || n.getPropValue('target') === node.id)));
        lines.forEach(line => {
          ctx.project.currentDocument?.removeNode(line.id);
        });
      }
      ctx.project.currentDocument?.removeNode(node.id);
    });
  }
}