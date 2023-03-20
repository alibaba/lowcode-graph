import TreeLayout from "@antv/hierarchy/lib/layout/base";
import util from '@antv/hierarchy/lib/util';

function getBBoxTopDistance(root) {
  if (!root) return 0;
  if (root.height === root.totalHeight) {
    return 0;
  }
  let startY = 0;
  root.eachNode(node => {
    if (node.y < startY) {
      startY = node.y;
    }
  });
  return root.y - startY;
}

function getBBoxBottomDistance(root) {
  if (!root) return 0;
  if (root.height === root.totalHeight) {
    return 0;
  }
  let endY = 0;
  root.eachNode(node => {
    if (node.y + node.height > endY) {
      endY = node.y + node.height;
    }
  });
  return endY - root.y;
}


class CompactBoxTreeLayout extends TreeLayout {
  execute() {
    const me = this;
    this.rootNode.children.forEach((item, index) => {
      if (index !== 0) {
        item.x = me.rootNode.children[0].x;
        const preNode = me.rootNode.children[index - 1];
        const preNodeSubLayout = preNode.data.subLayout;
        const itemSubLayout = item.data.subLayout;
        item.y = preNode.y + preNodeSubLayout && getBBoxBottomDistance(preNodeSubLayout) || preNode.height +  getBBoxTopDistance(itemSubLayout);
      }
    });
    return this.rootNode;
  }
}

const DEFAULT_OPTIONS = {
};

function customLayout(root, options) {
  options = util.assign({}, DEFAULT_OPTIONS, options);
  return new CompactBoxTreeLayout(root, options).execute();
}

export default customLayout;