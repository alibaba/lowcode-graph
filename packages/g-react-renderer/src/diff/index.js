import { get } from 'lodash';
import patch from "./vpatch";
/**
 * 二叉树 diff
 * @param lastVNode
 * @param newVNode
 */
 function diff (lastVNode, newVNode) {
  const walker = {index:0};
  const patches = {};
  // patches.old = lastVNode
  dftWalk(lastVNode, newVNode, walker, patches);
  return patches;
}

/**
 * 深入优先遍历算法 (depth-first traversal，DFT)
 * @param {*} lastVNode
 * @param {*} newVNode
 * @param {*} index
 * @param {*} patches
 */
function dftWalk(lastVNode, newVNode, walker, patches) {
  // 为保持当前步骤index不被children的diff而改变记错步骤
  const index = walker.index;
  if (lastVNode === newVNode) {
    return;
  }

  const currentPatch = [];

  // Node is removed
  if (newVNode === null || newVNode === undefined) {
    currentPatch.push({ type: patch.REMOVE, node: lastVNode });

  // diff text
  } else if (lastVNode.type === 'TEXT' && newVNode.type === 'TEXT') {
    if (get(newVNode, 'children[0].value') !== get(lastVNode,'children[0].value')) {
      currentPatch.push({ type: patch.TEXT, node: newVNode });
    }

  // same node  此处会出行，parentNode 先 moves 处理，childnode 再做一次处理（替换或修改属性）
  } else if (
    newVNode.type === lastVNode.type
    // && newVNode.key === lastVNode.key
  ) {
    // newVNode.key === lastVNode.key 才会执行 diffChildren
    if (newVNode.name === lastVNode.name) {
      const propsPatches = diffProps(lastVNode, newVNode);
      if (Object.keys(propsPatches).length > 1) {
        currentPatch.push({ type: patch.PROPS, props: propsPatches });
      }
      if (lastVNode.children && lastVNode.children.length > 0 || newVNode.children && newVNode.children.length >0) {
        diffChildren(
          lastVNode.children,
          newVNode.children,
          currentPatch,
          walker,
          patches,
        );
      }
    } else {
      currentPatch.push({ type: patch.REPLACE, node: newVNode });
    }

  // Nodes are not the same
  } else {
    currentPatch.push({ type: patch.REPLACE, node: newVNode });
  }

  if (currentPatch.length) {
    if (patches[index]) {
      patches[index].push(currentPatch);
    } else {
      patches[index] = currentPatch;
    }
  }
}

function diffChildren (lastChildren, newChildren, apply, walker, patches) {
  const orderedSet = reorder(lastChildren, newChildren);
  const len = lastChildren.length > newChildren.length ? lastChildren.length : newChildren.length;
  for (let i = 0; i < len; i++) {

    if (!lastChildren[i]) {
      // insert node
      if (newChildren[i] && !orderedSet.moves) {
        apply.push({ type: patch.INSERT, node: newChildren[i] });
      }

    } else {
      walker.index++;
      dftWalk(lastChildren[i], newChildren[i], walker, patches);
    }
  }
  // console.error('orderedSet.moves', orderedSet.moves);
  if (orderedSet.moves) {
    apply.push(orderedSet);
  }
}

/**
 * diff vnode props
 * @param {*} lastProps
 * @param {*} newProps
 */
function diffProps (lastVNode, newVNode) {
  const propsPatches = {
    props: {},
    box: {},
    style: {},
    type: newVNode.type,
  };
  ['props', 'box', 'style'].forEach(item => {
    // Find out diff props
    const last = lastVNode[item];
    const current = newVNode[item];
    for (const key in last) {
      if (current[key] !== last[key]) {
        propsPatches[item][key] = current[key];
      }
    }


    // Find out new props
    for (const key in current) {
      if (!last.hasOwnProperty(key)) {
        propsPatches[item][key] = current[key];
      }
    }

  });
  
  const availableProps = {};
  for (let key in propsPatches) {
    if (Object.keys(propsPatches[key]).length > 0) {
      availableProps[key] = propsPatches[key];
    }
  }
  return availableProps;
}

/**
 * List diff, naive left to right reordering
 * @param {*} lastChildren
 * @param {*} newChildren
 *
 * 原理利用中间数组 simulate， remove得到子集、insert 插入操作完成
 * 例 oldList [1,4,6,8,9] newList [0,1,3,5,6]
 * 转换拿到中间数组按老数组索引 [1, null, 6, null, null ]
 * remove null 得到子集 [1, 6]
 * insert 插入完成
 */
function reorder(lastChildren, newChildren) {
  const lastMap = keyIndex(lastChildren);
  const lastKeys = lastMap.keys;
  const lastFree = lastMap.free;

  if(lastFree.length === lastChildren.length){
    return {
      moves: null,
    };
  }


  const newMap = keyIndex(newChildren);
  const newKeys = newMap.keys;
  const newFree = newMap.free;

  if(newFree.length === newChildren.length){
    return {
      moves: null,
    };
  }

  // simulate list to manipulate
  const children = [];
  let freeIndex = 0;

  for (let i = 0 ; i < lastChildren.length; i++) {
    const item = lastChildren[i];
    if(item.key){
      if(newKeys.hasOwnProperty('key')){
        const itemIndex = newKeys[item.key];
        children.push(newChildren[itemIndex]);
      } else {
        children.push(null);
      }
    } else {
      const itemIndex = newFree[freeIndex++];
      children.push(newChildren[itemIndex] || null);
    }
  }

  const simulate = children.slice();
  const removes = [];
  const inserts = [];

  let j = 0;

  // remove  value is null and  no key property
  while (j < simulate.length) {
    if (simulate[j] === null || !simulate[j].hasOwnProperty('key')) {
      const patch = remove(simulate, j);
      removes.push(patch);
    } else {
      j++;
    }
  }

  console.error('simulate', simulate);
  for (let i = 0 ; i < newChildren.length; i++) {
    const wantedItem = newChildren[i];
    const simulateItem = simulate[i];

    if(wantedItem.key){
      if(simulateItem && wantedItem.key !== simulateItem.key){
        // key property is not equal, insert, simulateItem add placeholder
        inserts.push({
          type: patch.INSERT,
          index: i,
          node: wantedItem,
        });
        simulateItem.splice(i, 1);
      }
    } else {
      // no key property, insert, simulateItem add placeholder
      inserts.push({
        type: patch.INSERT,
        index: i,
        node: wantedItem,
      });
      simulateItem && simulateItem.splice(i, 1);
    }
  }

  return {
    type: patch.REORDER,
    moves: {
      removes,
      inserts,
    },
  };
}

function remove(arr, index) {
  arr.splice(index, 1);

  return {
    type: patch.REMOVE,
    index,
  };
}


/**
 * Convert list to key-item keyIndex object.
 * @param {*} children
 * convert [{id: "a", key: 'a'}, {id: "b", key: 'b'}, {id: "a"}]
 * result { keys: { a: 0, b: 1}, free: [ 2 ] }
 */
function keyIndex(children) {
  const keys = {};
  const free = [];
  const length = children.length;

  for (let i = 0; i < length; i++) {
      const child = children[i];

      if (child.key) {
          keys[child.key] = i;
      } else {
          free.push(i);
      }
  }

  return {
      keys,     // A hash of key name to index
      free,      // An array of unkeyed item indices
  };
}

export default diff;