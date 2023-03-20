import { isString, memoize, values } from '@antv/util';

let ctx: CanvasRenderingContext2D | null;

/**
 * 获取 canvas context
 */
export function getCanvasContext() {
  if (!ctx) {
    ctx = document.createElement('canvas').getContext('2d');
  }

  return ctx;
}

/**
 * 计算文本在画布中的宽高
 * @param text 文本
 * @param font 字体
 */
export const measureText = memoize(
  (text: string, font: any = {}): any => {
    const { fontSize = 12, fontFamily = 'PingFang SC', fontWeight, fontStyle, fontVariant } = font;

    // return {
    //   // 使用近似的文本高度
    //   // https://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
    //   height: fontSize * 1.2,
    //   width: fontSize * text.length,
    // };

    const ctx = getCanvasContext();
    if (ctx) {
      // @see https://developer.mozilla.org/zh-CN/docs/Web/CSS/font
      ctx.font = [fontStyle, fontWeight, fontVariant, `${fontSize}px`, fontFamily].join(' ');
      const metrics = ctx.measureText(isString(text) ? text : '');
      // metrics
      // actualBoundingBoxAscent: 8.63671875
      // actualBoundingBoxDescent: 2.654296875
      // actualBoundingBoxLeft: -1.025390625
      // actualBoundingBoxRight: 98.595703125
      // fontBoundingBoxAscent: 11
      // fontBoundingBoxDescent: 3
      // width: 99.380859375
      return {
        // 使用近似的文本高度
        // https://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
        height: fontSize * 1.2,
        width: metrics.width,
      };
    }
    return {
      height: 0,
      width: 0,
    };
  },
  (text: string, font = {}) => [text, ...values(font)].join('')
);
