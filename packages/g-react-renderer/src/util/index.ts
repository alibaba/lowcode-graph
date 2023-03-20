import { get, isNumber } from 'lodash';

interface IShadowStyle {
  shadowOffsetX?: string | number;
  shadowOffsetY?: string | number
  shadowBlur?: string | number
  shadowColor?: string
}

interface IOpacityStyle {
  opacity?: number;
  fillOpacity?: number;
  strokeOpacity?: number;
}

const localeTemp = get(window, 'g_config.locale') || 'zh_CN';
const locale = /^zh[-_]cn$/i.test(localeTemp) ? 'zh_CN' : 'en_US'
const varList = get(window, `arrangement[${locale}]`) || {};

export const i18n = (key: string) => {
  return varList[key] || key;
}

export const formatCssNumber = (value: number | string) => {
  const val = +(`${value}`).replace('px', '');
  return isNaN(val) ? 0 : val;
}

/**
 * 判断是否合法的透明度值，范围是 [0, 1]
 * @param value Number 透明度值
 * @returns Boolean
 */
export const isAlphaNumber = (value: any): boolean => {
  return isNumber(value) && (value >= 0 && value <= 1);
}

/**
 * 获取元素的阴影样式
 * @param style IShadowStyle 阴影样式
 * @returns IShadowStyle
 */
export const getShadowStyle = (style: IShadowStyle): IShadowStyle => {
  const {
    shadowOffsetX,
    shadowOffsetY,
    shadowBlur,
    shadowColor,
  } = style;
  const shadowStyle = {};
  if (shadowColor) {
    Object.assign(shadowStyle, {
      shadowColor,
      shadowBlur: formatCssNumber(shadowBlur || 0),
      shadowOffsetX: formatCssNumber(shadowOffsetX || 0),
      shadowOffsetY: formatCssNumber(shadowOffsetY || 0),
    })
  }
  return shadowStyle;
}

/**
 * 获取元素的透明度样式
 * @param style IOpacityStyle 透明度样式
 * @returns IOpacityStyle
 */
export const getOpacityStyle = (style: IOpacityStyle): IOpacityStyle => {
  const opacityStyle: IOpacityStyle = {};
  Object.keys(style).forEach(key => {
    const value = style[key as keyof IOpacityStyle]
    if (isAlphaNumber(value)) {
      opacityStyle[key as keyof IOpacityStyle] = value;
    }
  });
  return opacityStyle;
}
