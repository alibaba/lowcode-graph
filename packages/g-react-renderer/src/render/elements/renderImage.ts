import { getShadowStyle, getOpacityStyle } from '../../util';

const renderImage = (group: any) => (node: any) => {
  const { left, top, width, height } = node.box;
  const { clip, src, draggable } = node.props;
  const {
    shadowOffsetX,
    shadowOffsetY,
    shadowBlur,
    shadowColor,
    opacity,
    fillOpacity,
    strokeOpacity,
    cursor,
    zIndex,
  } = node.style;
  let nodeDraggable = node.draggable || draggable;
  nodeDraggable = nodeDraggable !== false;

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

  const image = group.addShape('image', {
    attrs: {
      // Common Attr
      name: `g-react-item-${node.name || Math.random()}`,
      // 暂未支持，可实现
      // fill,stroke,lineWidth,lineDash
      ...shadowStyle,
      ...opacityStyle,
      cursor,
      // Image Attr
      x: left,
      y: top,
      width,
      height,
      img: src,
    },
    draggable: nodeDraggable,
    zIndex: zIndex || 0
  });


  if (clip === 'circle') {
    // clip circle, 3.2.10暂不支持
    image.setClip({
      type: 'circle', // 支持 circle、rect、ellipse、Polygon 及自定义 path clip
      attrs: {
        r: width / 2,
        x: left + width / 2,
        y: top + height / 2,
      }
    });
  }

  return node;
};
export const updateImage = (targetElement: any) => (newProps: any, newStyle: any, oldVNode: any) => {
  // 优先使用新的clip属性
  const clip = newProps.clip || oldVNode.props.clip;
  let newAttr = { ...newProps };
  if (newProps.left !== undefined) {
    newAttr.x = newProps.left;
  }
  if (newProps.top !== undefined) {
    newAttr.y = newProps.top;
  }

  if (Object.keys(newStyle).length > 0) {
    const {
      // 阴影
      shadowOffsetX,
      shadowOffsetY,
      shadowBlur,
      shadowColor,
      // 透明度
      opacity,
      fillOpacity,
      strokeOpacity,
    } = newStyle;
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
    // assign
    newAttr = {
      ...newAttr,
      ...shadowStyle,
      ...opacityStyle,
    };
  }

  targetElement.attr(newAttr);

  if (clip === 'circle') {
    // clip circle, 3.2.10暂不支持
    const width = newAttr.width || oldVNode.box.width;
    const height = newAttr.height || oldVNode.box.height;
    const left = newAttr.left || oldVNode.box.left;
    const top = newAttr.top || oldVNode.box.top;
    targetElement.setClip({
      type: 'circle', // 支持 circle、rect、ellipse、Polygon 及自定义 path clip
      attrs: {
        r: width / 2,
        x: left + width / 2,
        y: top + height / 2,
      }
    });
  }
}

export default renderImage;
