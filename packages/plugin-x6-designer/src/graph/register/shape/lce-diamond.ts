import { BlueColor, DeepBlueColor, portR, strokeWidth } from "./const";

export const LceDiamond = {
  inherit: 'polygon',
  width: 124,
  height: 70,
  attrs: {
    body: {
      stroke: DeepBlueColor,
      strokeWidth,
      points: "0, 35, 62, 0, 124, 35, 62, 70",
      fill: '#fff',
      rx: 10,
      ry: 10
    },
    text: {
      width: 60,
      height: 32,
      fontSize: 12,
      fill: DeepBlueColor,
      x: 13,
      lineHeight: 16,
      textWrap: {
        width: 50,
        height: 14,
        ellipsis: true,  // 文本超出显示范围时，自动添加省略号
        breakWord: true, // 是否截断单词
      }
    },
    image: {
      width: 20,
      height: 20,
      x: 30,
      y: 24,
    },
  },
  markup: [
    {
      tagName: 'polygon',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'text',
    },
    {
      tagName: 'image',
      selector: 'image',
    },
  ],
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: portR,
            magnet: true,
            stroke: BlueColor,
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
              opacity: '1'
            },
          },
        },
        zIndex: 99,
      },
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: portR,
            magnet: true,
            stroke: BlueColor,
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
              opacity: '1'
            },
          },
        },
        zIndex: 99,
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: portR,
            magnet: true,
            stroke: BlueColor,
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
              opacity: '1'
            },
          },
        },
        zIndex: 99,
      },
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: portR,
            magnet: true,
            stroke: BlueColor,
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
              opacity: '1'
            },
          },
        },
        zIndex: 99,
      },
    },
    items: [
      {
        id: 't',
        group: 'top',
      },
      {
        id: 'r',
        group: 'right',
      },
      {
        id: 'b',
        group: 'bottom',
      },
      {
        id: 'l',
        group: 'left',
      },
    ],
  },
}