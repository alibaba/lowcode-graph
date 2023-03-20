import vpatch from './vpatch.js';
import renderRect, {updateRect} from '../render/elements/renderRect';
import renderText, {updateText} from '../render/elements/renderText';
import renderImage, {updateImage} from '../render/elements/renderImage';

/**
 * 真实的 Dom 打补钉
 * @param {*} rootNode 实际的 DOM
 * @param {*} patches
 */
function patch (rootNode, patches, group) {
  const walker = { index: 0 };
  dftWalk(rootNode, walker, patches, group);
}

/**
 * 深入优先遍历算法 (depth-first traversal，DFT)
 * @param {*} node
 * @param {*} walker
 * @param {*} patches
 */
function dftWalk (node, walker, patches, group) {
  const currentPatches = patches[walker.index] || [];
  // TEXT元素不往里遍历children，和diff算法的识别TEXT change逻辑保持一致
  node.type !== 'TEXT' && node.children && node.children.forEach(child => {
    walker.index++;
    dftWalk(child, walker, patches, group);
  });
  if (currentPatches && currentPatches.length > 0) {
    applyPatches(node, currentPatches, group);
  }
}


function applyPatches (node, currentPatches, group) {
  const targetElement = group.find(item => item.attr('name') === `g-react-item-${node.name}`);
  currentPatches.forEach(currentPatch => {
    if (targetElement || currentPatch.type === vpatch.INSERT) {
      const newNode = currentPatch.node;
      switch (currentPatch.type) {
        case vpatch.REMOVE:
          targetElement.remove();
          break;
        case vpatch.REPLACE:
          // node.parentNode.replaceChild(render(newNode), node);
          targetElement.remove();
          switch(newNode.type) {
            case 'TEXT':
              renderText(group)(newNode);
              break;
            case 'RECT':
              renderRect(group)(newNode);
              break;
            case 'IMAGE':
              renderImage(group)(newNode);
              break;
            default:
              break;
          }
          break;
        case vpatch.TEXT:
          if (node.parent && node.parent.type === 'RECT') {
            const parentElement = group.find(item => item.attr('name') === `g-react-item-${node.parent.name}`);
            const parentX = parentElement && parentElement.attrs.x || 0;
            const parentY = parentElement && parentElement.attrs.y || 0;
            setTimeout(() => {
              // 需要根据父框left和top来做一次相对定位
              const newParentElement = group.find(item => item.attr('name') === `g-react-item-${node.parent.name}`);
              const newParentX = newParentElement && newParentElement.attrs.x || 0;
              const newParentY = newParentElement && newParentElement.attrs.y || 0;
              newNode.box.left += (newParentX - parentX);
              newNode.box.top += (newParentY - parentY);
              // newNode.box.left = 0;
              // newNode.box.tpo = 0;
              updateText(targetElement)(newNode);
            }, 30);
          }
          break;
        case vpatch.PROPS:
          setProps(node, currentPatch.props, targetElement, group);
          break;
        case vpatch.INSERT:
          switch(newNode.type) {
            case 'TEXT':
              if (newNode.parent && newNode.parent.type === 'RECT') {
                setTimeout(() => {
                  // 需要根据父框left和top来做一次相对定位
                  const newParentElement = group.find(item => item.attr('name') === `g-react-item-${node.parent.name}`);
                  if (newParentElement) {
                    const newParentX = newParentElement.attrs.x;
                    const newParentY = newParentElement.attrs.y;
                    newNode.box.left += newParentX;
                    newNode.box.top += newParentY;
                  }
                  renderText(group)(newNode);
                }, 10);
              } else {
                renderText(group)(newNode);
              }
              break;
            case 'RECT':
              renderRect(group)(newNode);
              break;
            case 'IMAGE':
              renderImage(group)(newNode);
              break;
            default:
              break;
          }
          break;
        case vpatch.REORDER:
          // reorderChildren(node, currentPatch.moves);
          break;
        default:
          break;
      }
    }
  });
}

/**
 * 设置真实 Dom 属性值
 * @param {*} node
 * @param {*} props
 */
function setProps (node, props, targetElement, group) {
  let newProps = {};
    ['props', 'box'].forEach(item => {
      newProps = {
        ...newProps,
        ...(props[item] || {}),
      };
    });
    let newStyle = {};
    if (Object.keys(props.style || {}).length > 0) {
      // 有style变化
      newStyle = {
        ...node.style,
        ...props.style,
      };
    }

    // TODO 父元素有xy变化时 需要根据新的xy与老xy的差值来定位子元素。但如果父xy未变更，则直接以xy来定位
    if (node.type === 'RECT') {
      if ((newProps.left || newProps.top) && node.children && node.children.length > 0) {
        // 涉及RECT定位变更，则children为TEXT的元素跟随移动
        node.children.forEach(child => {
          if (child.type === 'TEXT') {
            const childTextTarget = group.find(item => item.attr('name') === `g-react-item-${child.name}`);
            if (childTextTarget) {
              let x = childTextTarget.attrs.x || 0, y = (childTextTarget.attrs.y || 0);
              if (newProps.left) {
                x += newProps.left - (targetElement.attrs.x || 0);
              }
              if (newProps.top) {
                y += newProps.top - (targetElement.attrs.y || 0);
              }
              childTextTarget.attr({
                x,
                y
              });
            }
          }
        })
      }
      updateRect(targetElement)(newProps, newStyle);
    } else if (node.type === 'IMAGE') {
      updateImage(targetElement)(newProps, newStyle, node);
    }
}

/**
 * reorderChildren 处理 list diff render
 * @param {*} domNode
 * @param {*} moves
 */
function reorderChildren(domNode, moves) {
  for (const i = 0; i < moves.removes.length; i++) {
    const { index } = moves.removes[i];
    const node = domNode.childNodes[index];
    domNode.removeChild(node);
  }

  for (const j = 0; j < moves.inserts.length; j++) {
    const { index, node } = moves.inserts[j];
    domNode.insertBefore(node, index === domNode.childNodes.length ? null : childNodes[index]);
  }
}

export default patch;