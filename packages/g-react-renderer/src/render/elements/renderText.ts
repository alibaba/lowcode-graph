import * as R from 'ramda';
import { measureText } from '../../util/measureText';
import { measureTextWidth } from '@antv/util';

const fittingString = (str: string, maxWidth: number, fontSize: number) => {
  let currentWidth = 0;
  let res = str;
  const insertIndex: number[] = [];
  const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
  const tempArr = str.split('');
  tempArr.forEach((letter, i) => {
    if (currentWidth > maxWidth) return;
    if (pattern.test(letter)) {
      // Chinese charactors
      currentWidth += fontSize;
    } else {
      // get the width of single letter according to the fontSize
      currentWidth += measureTextWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth) {
      insertIndex.push(i);
      currentWidth = 0;
    }
  });
  insertIndex.forEach(item => {
    tempArr.splice(item, 0, '\n');
  });
  res = tempArr.join('');
  return res;
};


function getSubText(text: string, style: any, remainWidth: number) {
  const splitIdx = Math.floor(text.length / 2);
  const prevStr = text.substring(0, splitIdx);
  const nextStr = text.substring(splitIdx);

  const prevInfo = measureText(prevStr, style);
  const prevWidth = prevInfo.width || 0;

  let matchedStr = '';

  // 如第一段仍较长，则继续进行拆分
  if (text && text.length > 2) {
    if (prevWidth > remainWidth) {
      matchedStr = getSubText(prevStr, style, remainWidth);
    } else {
      // 如第一段不够长，则处理第二段，叠加宽度
      matchedStr = prevStr + getSubText(nextStr, style, remainWidth - prevWidth);
    }
  }

  return matchedStr;
}

function clipText(text: string, style: any, maxWidth: number, config: any = {}) {
  const { indicator = '\u2026' } = config;
  const textInfo = measureText(text, style);

  // indicator: \u2026 -> ...
  // 进行 clip
  if (textInfo.width > maxWidth) {
    if (style.textOverflow === 'ellipsis') {
      // 截断...
      const indicatorInfo = measureText(indicator, style);
      // 基于二分法计算字符宽度
      // clip text
      const subText = getSubText(text, style, maxWidth - indicatorInfo.width);
      return subText + indicator;
    } else {
      // 换行
      return fittingString(text, maxWidth, style.fontSize || 14);
    }
  }

  return text;
}

const renderText = (nodeGroup: any) => (node: any) => {
  const { top, left } = node.box;
  const { link, cursor, name, draggable } = node.props;
  // 目前简化处理,仅处理第一个 text instance
  if (node && node.children && node.children[0] && node.children[0].value) {
    const text = node.children[0].value;
    const attributes = node.style || {};
    const textColor = attributes.color || '#000';
    let nodeDraggable = node.draggable || draggable;
    nodeDraggable = nodeDraggable !== false;

    const textStyle = {};
    if (attributes.fontSize) {
      Object.assign(textStyle, {
        fontSize: attributes.fontSize,
      });
    }

    const commonStyle = {};
    if (attributes.cursor) {
      Object.assign(commonStyle, {
        cursor: attributes.cursor,
      });
    }

    let showTip = false;

    let resultText = text;

    if (attributes.maxWidth || attributes.width) {
      resultText = clipText(text, attributes, attributes.maxWidth);
      // console.log(attributes, text, resultText, measureText(resultText, attributes));
      node.box.height = 48;
    }

    if (resultText !== text) {
      showTip = true;
    }

    nodeGroup.addShape('text', {
      attrs: {
        ...R.omit(['fontSize'], attributes),
        // Common Attr
        name: `g-react-item-${node.name || Math.random()}`,
        fill: textColor,
        cursor: cursor || (link && 'pointer'),
        ...commonStyle,
        // 暂未支持，需判断是否可以和必要实现
        // stroke,lineWidth,lineDash,shadowColor,shadowBlur,shadowOffsetX,shadowOffsetY,opacity,fillOpacity,strokeOpacity
        
        // Text Attr
        text: resultText,
        x: left,
        y: top,
        textBaseline: 'top',
        fontFamily: attributes.fontFamily || 'PingFang SC',
        ...textStyle,
        // 暂未支持，需判断是否可以和必要实现
        // textAlign,fontStyle,fontVariant,fontWeight,fontSize,lineHeight

        // Extra Attr
        showTip,
        fullText: text,
        // add link support
        link,
      },
      draggable: nodeDraggable,
    });

    // 如果文字被 clip，则展示相应 tooltip
    // https://g6.antv.vision/zh/examples/tool/tooltip#tooltipLocalCustom
  }
  return node;
}

export const updateText = (targetElement: any) => (node: any) => {
  const { top, left } = node.box;
  const { link, cursor } = node.props;
  // 目前简化处理,仅处理第一个 text instance
  if (node && node.children && node.children[0] && node.children[0].value) {
    const text = node.children[0].value;
    const attributes = node.style || {};
    const textColor = attributes.color || '#000';

    const textStyle = {};
    if (attributes.fontSize) {
      Object.assign(textStyle, {
        fontSize: attributes.fontSize,
      });
    }

    const commonStyle = {};
    if (attributes.cursor) {
      Object.assign(commonStyle, {
        cursor: attributes.cursor,
      });
    }
    let showTip = false;

    let resultText = text;

    if (attributes.maxWidth || attributes.width) {
      resultText = clipText(text, attributes, attributes.maxWidth);
      // console.log(attributes, text, resultText, measureText(resultText, attributes));
      node.box.height = 48;
    }

    if (resultText !== text) {
      showTip = true;
    }

    targetElement.attr({
      ...R.omit(['fontSize'], attributes),
      // Common Attr
      fill: textColor,
      cursor: cursor || (link && 'pointer'),
      ...commonStyle,
      // 暂未支持，需判断是否可以和必要实现
      // stroke,lineWidth,lineDash,shadowColor,shadowBlur,shadowOffsetX,shadowOffsetY,opacity,fillOpacity,strokeOpacity
      
      // Text Attr
      text: resultText,
      x: left,
      y: top,
      textBaseline: 'top',
      fontFamily: attributes.fontFamily || 'PingFang SC',
      ...textStyle,
      // 暂未支持，需判断是否可以和必要实现
      // textAlign,fontStyle,fontVariant,fontWeight,fontSize,lineHeight

      // Extra Attr
      showTip,
      fullText: text,
    })
    // 如果文字被 clip，则展示相应 tooltip
    // https://g6.antv.vision/zh/examples/tool/tooltip#tooltipLocalCustom
  }
  return node;
}

// export default R.curryN(2, renderText);
export default renderText;
