import { getShadowStyle, getOpacityStyle } from "../../util";
import { isNumber } from 'lodash';

export const renderRect = (nodeGroup: any) => (node: any) => {
  const { top, left, width, height } = node.box;
  const { link, draggable } = node.props;
  let nodeDraggable = node.draggable || draggable;
  nodeDraggable = nodeDraggable !== false;
  const {
    backgroundColor,
    borderTopLeftRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
    borderTopRightRadius,
    borderColor,
    borderLeftWidth,
    borderLeftColor,
    shadowOffsetX,
    shadowOffsetY,
    shadowBlur,
    shadowColor,
    opacity,
    fillOpacity,
    strokeOpacity,
    cursor,
    // 旋转角度
    rotate,
    // 偏移 {x: number, y: number }
    translate,
    zIndex
  } = node.style;

  // FIXME: HACK
  const lineWidth = borderLeftWidth || 0;
  const stroke = borderLeftColor || '';
  const radius = [
    borderTopLeftRadius || 0,
    borderTopRightRadius || 0,
    borderBottomRightRadius || 0,
    borderBottomLeftRadius || 0,
  ];

  // shadow
  const shadowStyle = getShadowStyle({
    shadowOffsetX,
    shadowOffsetY,
    shadowBlur,
    shadowColor,
  });

  // opacity
  const opacityStyle = getOpacityStyle({
    opacity,
    fillOpacity,
    strokeOpacity,
  });

  const rect = nodeGroup.addShape('rect', {
    attrs: {
      // Common Attr
      name: `g-react-item-${node.name || Math.random()}`,
      fill: backgroundColor,
      stroke,
      lineWidth,
      // 暂未支持，可实现
      // lineDash,
      ...shadowStyle,
      ...opacityStyle,
      cursor: cursor || (link && 'pointer'),
      // Rect Attr
      x: left,
      y: top,
      width,
      height,
      radius,
      // Extra Attr
      link,
    },
    draggable: nodeDraggable,
    zIndex: zIndex || 0
  });

  if (rotate) {
    rect.rotate(rotate);
  }

  if (translate && (isNumber(translate.x) && isNumber(translate.y))) {
    rect.translate(translate.x, translate.y);
  }

  return node;
};

export const updateRect = (targetElement: any) => (newProps: any, newStyle: any) => {
  let newAttr = { ...newProps };
  if (newProps.left !== undefined) {
    newAttr.x = newProps.left;
  }
  if (newProps.top !== undefined) {
    newAttr.y = newProps.top;
  }
  if (Object.keys(newStyle).length > 0) {
    const {
      backgroundColor,
      borderTopLeftRadius,
      borderBottomRightRadius,
      borderBottomLeftRadius,
      borderTopRightRadius,
      borderLeftWidth,
      borderLeftColor,
      shadowOffsetX,
      shadowOffsetY,
      shadowBlur,
      shadowColor,
      opacity,
      fillOpacity,
      strokeOpacity,
    } = newStyle;

    // FIXME: HACK
    const lineWidth = borderLeftWidth || 0;
    const stroke = borderLeftColor || '';
    const radius = [
      borderTopLeftRadius || 0,
      borderTopRightRadius || 0,
      borderBottomRightRadius || 0,
      borderBottomLeftRadius || 0,
    ];

    // shadow
    const shadowStyle = getShadowStyle({
      shadowOffsetX,
      shadowOffsetY,
      shadowBlur,
      shadowColor,
    });

    // opacity
    const opacityStyle = getOpacityStyle({
      opacity,
      fillOpacity,
      strokeOpacity,
    });

    newAttr = {
      ...newAttr,
      fill: backgroundColor,
      radius,
      stroke,
      lineWidth,
      ...shadowStyle,
      ...opacityStyle,
    };
  }
  targetElement.attr(newAttr);
}

export default renderRect;
