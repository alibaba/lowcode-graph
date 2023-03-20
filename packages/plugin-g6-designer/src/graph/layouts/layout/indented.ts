import TreeLayout from '@antv/hierarchy/lib/layout/base';

const DEFAULT_INDENT = 20;
/* 纵向布局 */
function positionNode(node: any, previousNode: any, parent: any, dx: number) {
  let externalGap = 0;
  if (
    previousNode // 存在上个节点
    && previousNode.data
    && (previousNode.data.children && previousNode.data.children.length > 0)
  ) {
    externalGap = 15;
  }
  // 控制left offset，要与edges.js里的source anchor匹配
  if (parent) {
    if (parent.width < 100) {
      node.leftOffset = node.width / 2 + parent.leftOffset;
    } else {
      node.leftOffset = node.width / 2 + parent.leftOffset - parent.width / 2 + 50;
    }
  } else {
    node.leftOffset = node.width / 2;
  }
  node.x += dx * node.depth + node.leftOffset;
  node.y = (previousNode ? previousNode.y + previousNode.height / 2 : 0)
    + node.height / 2 + externalGap;
}

const indentedTree = (root: any, indent = DEFAULT_INDENT) => {
  let previousNode: any = null;
  root.eachNode((node: any) => {
    positionNode(node, previousNode, node.parent, indent);
    previousNode = node;
  });
};

const VALID_DIRECTIONS = [
  'LR', // left to right
  'RL', // right to left
];
const DEFAULT_DIRECTION = VALID_DIRECTIONS[0];

class IndentedLayout extends TreeLayout {
  execute() {
    const me: any = this;
    const options = me.options;
    const root = me.rootNode;
    options.isHorizontal = true;
    const indent = options.indent;
    const direction = options.direction || DEFAULT_DIRECTION;
    if (direction && VALID_DIRECTIONS.indexOf(direction) === -1) {
      throw new TypeError(`Invalid direction: ${direction}`);
    }
    if (direction === VALID_DIRECTIONS[0]) { // LR
      indentedTree(root, indent);
    } else if (direction === VALID_DIRECTIONS[1]) { // RL
      indentedTree(root, indent);
      root.right2left();
    }
    return root;
  }
}

const DEFAULT_OPTIONS = {
};

function indentedLayout(root: any, options: any) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  // @ts-ignore
  return new IndentedLayout(root, options).execute();
}

export default indentedLayout;
