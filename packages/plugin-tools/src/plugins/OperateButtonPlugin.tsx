import React, { PureComponent } from 'react'
import { ILowCodePluginContext, hotkey } from '@alilc/lowcode-engine'
import { Button } from '@alifd/next'

interface IOperateButtonProps {
  ctx: ILowCodePluginContext // 上下文
  callback: (schema: any) => void // 回调函数
  text: string // 按钮显示文本
  btnProps?: any // 按钮属性
}

interface IOpratePluginOption {
  callback: (schema: any) => void
  name: string
  text: string
  btnProps?: any
  hotkey?: string
}

// 操作按钮
class OperateButton extends PureComponent<IOperateButtonProps> {
  handleClick = () => {
    const { ctx, callback } = this.props
    const currentSchema = ctx.project.currentDocument?.exportSchema()
    callback?.(currentSchema)
  }

  render() {
    const { text, btnProps } = this.props
    return (
      <Button type="primary" {...btnProps} onClick={this.handleClick}>
        {text}
      </Button>
    )
  }
}

// 操作按钮插件
const OperateButtonPlugin = (ctx: ILowCodePluginContext, options: IOpratePluginOption | IOpratePluginOption[]) => {
  const buttonsArray = Array.isArray(options) ? options : [options]
  return {
    name: 'operateButton',
    async init() {
      const { skeleton } = ctx
      buttonsArray.forEach((item: IOpratePluginOption) => {
        // 添加按钮
        skeleton.add({
          name: item.name,
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: OperateButton,
          contentProps: {
            ctx,
            callback: item.callback,
            text: item.text,
            btnProps: item.btnProps,
          },
        })
        // 添加快捷键
        item.hotkey &&
          hotkey.bind(item.hotkey, (e: any) => {
            e.preventDefault()
            const currentSchema = ctx.project.currentDocument?.exportSchema()
            item.callback(currentSchema)
          })
      })
    },
  }
}

OperateButtonPlugin.pluginName = 'operateButtonPlugin'
OperateButtonPlugin.meta = {
  preferenceDeclaration: {
    title: '自定义操作按钮',
    properties: [
      {
        key: 'callback',
        type: 'Function',
        description: '用户自定义按钮处理',
      },
      {
        key: 'name',
        type: 'Function',
        description: '用户自定义按钮名',
      },
      {
        key: 'text',
        type: 'Function',
        description: '用户自定义按钮文本',
      },
      {
        key: 'btnProps',
        type: 'Object',
        description: '自定义按钮属性设置',
      },
      {
        key: 'hotKey',
        type: 'Function',
        description: '用户自定义按钮快捷键',
      },
    ],
  },
}

export default OperateButtonPlugin
