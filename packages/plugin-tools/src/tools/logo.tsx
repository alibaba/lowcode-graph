import React from 'react'
import { ILowCodePluginContext } from '@alilc/lowcode-engine'

class Logo extends React.Component<{ ctx: ILowCodePluginContext; imgUrl?: string; style?: any }, any> {
  render() {
    const { imgUrl, style } = this.props
    return (
      <img
        alt="Logo"
        src={imgUrl || 'https://img.alicdn.com/imgextra/i2/O1CN01uv6vu822RBCSYLro2_!!6000000007116-55-tps-139-26.svg'}
        style={style}
      />
    )
  }
}

export const logo = (ctx: ILowCodePluginContext, options: { imgUrl: string; style?: any }) => {
  return {
    name: 'logo',
    async init() {
      const { skeleton } = ctx

      skeleton.add({
        name: 'logo',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'left',
        },
        content: Logo,
        contentProps: {
          ctx,
          ...options,
        },
      })
    },
  }
}
logo.pluginName = 'logo'
logo.meta = {
  preferenceDeclaration: {
    title: 'logo配置',
    properties: [
      {
        key: 'imgUrl',
        type: 'string',
        description: '用户自定义logo资源',
      },
      {
        key: 'style',
        type: 'any',
        description: '用户自定义logo样式',
      },
    ],
  },
}
