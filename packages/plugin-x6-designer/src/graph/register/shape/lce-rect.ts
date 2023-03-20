import { portR, BlueColor, strokeWidth } from "./const";

export const LceRect = {
  inherit: 'rect',
  width: 124,
  height: 42,
  attrs: {
    body: {
      stroke: '#4C6079',
      strokeWidth,
      fill: '#fff',
      rx: 21,
      ry: 21,
    },
    text: {
      width: 60,
      height: 32,
      fontSize: 12,
      fill: '#4C6079',
      x: 10,
      lineHeight: 16,
      textWrap: {
        width: 60,
        height: '80%',
        ellipsis: true,  // 文本超出显示范围时，自动添加省略号
        breakWord: true, // 是否截断单词
      }
    },
    image: {
      width: 30,
      height: 30,
      x: 8,
      y: 6,
    },
  },
  markup: [
    {
      tagName: 'rect',
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