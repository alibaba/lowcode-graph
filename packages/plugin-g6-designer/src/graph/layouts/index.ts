import {
  compactBox, dendrogram, mindmap,
  indented
  // @ts-ignore
} from '@antv/hierarchy';
import { cloneDeep } from 'lodash';
import customLayout from './layout/customLayout';
import customTreeGrid from './layout/customTreeGrid';

export type TreeLayoutConfig = {
  data?: any;
  [key: string]: unknown;
}

export type TreeLayoutConfigMap = {
  [key: string]: TreeLayoutConfig,
}

function getTotalHeight(root: any) {
  if (!root) return 0;
  let bottom = 0;
  root.eachNode((node: any) => {
    if ((node.y + node.height) > bottom) {
      bottom = node.y + node.height;
    }
  });
  return bottom - root.y;
}

export class MixedTreeLayout {
  public static layoutMethodMap: any = {};

  public data: any;
  public configMap: any;

  static registerLayoutMethod(methodName: string, method: any) {
    MixedTreeLayout.layoutMethodMap[methodName] = method;
  }

  constructor(cfg: TreeLayoutConfigMap) {
    this.configMap = cfg;
  }

  init(data: any) {
    this.data = data;
  }

  execute() {
    const me = this;
    const options = {
      getId: function getId(d: any) {
        return d.id;
      },
      getHeight: function getHeight(d: any) {
        return d.height || 16;
      },
      getWidth: function getWidth(d: any) {
        return d.width || 16;
      },
      getVGap: function getVGap() {
        return 18;
      },
      getHGap: function getHGap() {
        return 18;
      },
    };

    function getLayoutConfig(layoutType: string) {
      if (me.configMap[layoutType]) {
        return {
          ...options,
          ...me.configMap[layoutType]
        }
      }
      return null;
    }

    const data = this.data;

    function extractSubGraph(parentNode: any, subGraphMap: any) {
      // const clonedParentNode = cloneDeep(parentNode);
      const clonedParentNode = parentNode;

      clonedParentNode && clonedParentNode.children && clonedParentNode.children.forEach((node: any, idx: number) => {
        // console.log(`node ${node.id} ${node.layout}, parent node: ${clonedParentNode.id} ${clonedParentNode.layout}`);

        // 当子节点有 layout 且与父节点布局类型不一致且子节点有子节点时，则进行子图拆分
        if (node.layout && node.layout !== clonedParentNode.layout && node.children && node.children.length > 0) {
          // console.log(`extract node ${node.id} from ${clonedParentNode.id}`);

          subGraphMap[node.id] = extractSubGraph(cloneDeep(node), subGraphMap);

          node.groupType = 'group';
          node.backupChildren = cloneDeep(node.children);
          delete node.children;
        } else {
          // 继续提取该节点的子节点
          clonedParentNode.children[idx] = extractSubGraph(node, subGraphMap);
        }
      });

      return clonedParentNode;
    }

    function splitGraph(graphData: any): any {
      // 子图合集
      const subGraphMap: any = {};
      subGraphMap['root'] = extractSubGraph(graphData, subGraphMap);
      return subGraphMap;
    }

    function eachNode(root: any, callback: any) { // Depth First traverse
      let nodes = [root];
      let current;
      while (current = nodes.shift()) {
        callback(current);
        if (current.children) {
          nodes = current.children.concat(nodes);
        }
      }
    }

    function calculateLayout(subGraphData: any) {
      const layoutType = MixedTreeLayout.layoutMethodMap[subGraphData.layout] ? subGraphData.layout : 'compactBox';
      const nodeLayoutMethod = MixedTreeLayout.layoutMethodMap[layoutType];
      // 填充 bbox 替换 group 宽高
      // console.log('calculate', subGraphData);

      eachNode(subGraphData, (node: any) => {
        if (node.groupType === 'group' && subGraphMap[node.id]) {
          const subLayout = calculateLayout(subGraphMap[node.id]);
          const bbox = subLayout.getBoundingBox();
          if (node.layout === 'compactBox') {
            // 如果被切割出来的group是compactBox布局的，总高度需自己计算
            bbox.height = getTotalHeight(subLayout);
          }
          const size = [bbox.width, bbox.height];
          // backup node info
          if (!node.nodeInfo) {
            node.nodeInfo = {
              size: node.size,
              width: node.width,
              height: node.height,
            }
          }

          node.subLayout = subLayout;

          node.size = size;
          node.width = size[0];
          node.height = size[1];
        }
      });

      // TODO: replace options
      const temp = nodeLayoutMethod(subGraphData, getLayoutConfig(layoutType) || options);
      return temp;
    }

    // console.time('split graph');
    // 1. 切分子图, 将一颗树切分为多个子图，子图根节点与父图相关联
    const subGraphMap = splitGraph(data);
    // console.timeEnd('split graph');
    // 2. 计算所有子图的布局，计算后算出子图的 bbox，通过缓存已计算子图布局实现剪枝
    const layoutDataMap: any = {};

    // console.time('calculate layout');
    for (let key in subGraphMap) {
      const subGraphData = subGraphMap[key];
      layoutDataMap[key] = calculateLayout(subGraphData);
    }
    // console.timeEnd('calculate layout');
    // TODO: FIXME: calculateLayout(layoutDataMap['root']);

    const root = layoutDataMap['root'];

    // console.log(layoutDataMap);
    // 3. 基于节点 id 进行子图拼合，替换 group 节点，基于 group 节点进行位移变换
    root.eachNode((node: any) => {
      if (node.data.groupType === 'group') {
        const subLayoutRoot = layoutDataMap[node.data.id];
        // 计算  bbox getBoundingBox
        // console.log('subLayout', node, subLayoutRoot, subLayoutRoot.getBoundingBox());
        // console.log('distance', node.x - subLayoutRoot.x, node.y - subLayoutRoot.y);
        subLayoutRoot.eachNode((subNode: any) => {
          // subNode.parent = node;
          if (subNode.parent) {
            subNode.x += (node.x - subLayoutRoot.x + (subNode.data.xOffset || 0));
            subNode.y += (node.y - subLayoutRoot.y + (subNode.data.yOffset || 0));
          }
        });
        // reset group node size
        node.data.size = node.data.nodeInfo.size;
        node.data.width = node.data.nodeInfo.width;
        node.data.height = node.data.nodeInfo.height;
        node.data.children = node.data.backupChildren;
        // 直接替换 group 节点
        node.children = subLayoutRoot.children;
        // 根节点偏移量
        node.x += subLayoutRoot.data.xOffset || 0;
        node.y += subLayoutRoot.data.yOffset || 0;
        // 删除 group type
        delete node.data.groupType;
        delete node.data.backupChildren;
      }
    });
    return root;
  }

  layout(data: any) {
    this.init(data);
    return this.execute();
  }

  destroy() {
    this.data = null;
  }
}

MixedTreeLayout.registerLayoutMethod('compactBox', compactBox);
MixedTreeLayout.registerLayoutMethod('dendrogram', dendrogram);
MixedTreeLayout.registerLayoutMethod('mindmap', mindmap);
MixedTreeLayout.registerLayoutMethod('indented', indented);
MixedTreeLayout.registerLayoutMethod('customLayout', customLayout);
MixedTreeLayout.registerLayoutMethod('customTreeGrid', customTreeGrid);

