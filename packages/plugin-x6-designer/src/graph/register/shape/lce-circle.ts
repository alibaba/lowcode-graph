export const LceCircle = {
  inherit: 'circle',
  width: 50,
  height: 50,
  attrs: {
    circle: {
      stroke: '#4C6079',
      strokeWidth: 1,
      fill: '#fff',
      r: 50,
    },
    text: {
      fontSize: 12,
      fill: '#4C6079',
      x: 10,
    },
  },
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: '#A5AFBC',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
        zIndex: 99,
      },
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: '#A5AFBC',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
        zIndex: 99,
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: '#A5AFBC',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
        zIndex: 99,
      },
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: '#A5AFBC',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
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