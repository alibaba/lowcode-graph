import TreeLayout from "@antv/hierarchy/lib/layout/base";
import util from '@antv/hierarchy/lib/util';


function transTree(root, callback) {
  let nodes = [root];
  let current;
  while (current = nodes.shift()) {
    callback(current);
    if (current.children) {
      nodes = nodes.concat(current.children);
    }
  }
}

class CustomTreeGrid extends TreeLayout {
  execute() {
    // 树转换成二维数组
    const me = this;
    const tMap = {};
    transTree(this.rootNode, (node) => {
      if (tMap[node.depth]) {
        tMap[node.depth].push(node);
      } else {
        tMap[node.depth] = [node];
      }
      node.depth = node.data.depth || node.depth;
    });
    Object.keys(tMap).forEach(i => {
      // 按行
      if (i > 0) {
        tMap[i].forEach((j, index) => {
          // 按列
          if (index > 0) {
            const preNode = tMap[i][index - 1];
            j.x = preNode.x + preNode.width + me.options.vGap;
            j.y = preNode.y || 0;
            j.lineMaxHeight = j.height > (preNode.lineMaxHeight || preNode.height || 0) ? j.height : (preNode.lineMaxHeight || preNode.height || 0);
          } else {
            const preLine = tMap[i - 1];
            j.y = (preLine[0].y || 0) + (preLine[preLine.length - 1].lineMaxHeight || preLine[preLine.length - 1].height || 0) + me.options.hGap;
            j.lineMaxHeight = j.height;
          }
        });
        const lastNode = tMap[i][tMap[i].length - 1];
        const lastNodeRight = lastNode.x + lastNode.width;
        tMap[i].forEach((j, index) => {
          // 每个节点都带上本行最大高度
          if (j.data) {
            j.data.lineMaxHeight = lastNode.lineMaxHeight - 2 * lastNode.vgap; // 不包含gap的最大高度
          }
          //  居中处理
          j.x = j.x - (lastNodeRight - this.rootNode.width)/2;
        });
      }
    });
    this.rootNode.hasAlign = true;
    return this.rootNode;
  }
}


const DEFAULT_OPTIONS = {
  vGap: 20,
  hGap: 20,
};

function customLayout(root, options) {
  options = util.assign({}, DEFAULT_OPTIONS, options);
  return new CustomTreeGrid(root, options).execute();
}

export default customLayout;