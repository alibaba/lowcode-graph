import { LceCircle } from './register/shape/lce-circle';
import { Graph } from '@antv/x6';
import { LceDiamond } from './register/shape/lce-diamond';
import { LceRect } from './register/shape/lce-rect';

function registerNode(nodeName: string, node: any) {
  // 在 registerNode 前进行 unregisterNode, 防止在多资源场景下由于注册重复的 node 导致报错。
  Graph.unregisterNode(nodeName);
  Graph.registerNode(nodeName, node);
}

/**
 * 注册 shape
 */
export function registerShape() {
  registerNode('lce-rect', LceRect);

  registerNode('lce-diamond', LceDiamond);

  registerNode('lce-circle', LceCircle);
}
