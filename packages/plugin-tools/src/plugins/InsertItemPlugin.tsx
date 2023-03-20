import React, { PureComponent } from 'react'
import { ILowCodePluginContext, hotkey } from '@alilc/lowcode-engine'
import { EditorCommand } from '../common'

interface IInsertProps {
  ctx: ILowCodePluginContext // 上下文
  model: any // 节点配置
  nodeType: EditorCommand.insertChildNode | EditorCommand.insertSiblingNode
}

// 插入渲染
class InsertView extends PureComponent<IInsertProps> {
  handleClick = () => {
    const { ctx, model, nodeType } = this.props
    const selectedNodes = ctx.project.currentDocument?.selection.getNodes()
    if (selectedNodes && selectedNodes.length > 0) {
      // 有选中节点触发
      ctx.event.emit(EditorCommand[nodeType], { selectedNodes, model })
    }
  }

  render() {
    const { nodeType } = this.props
    return (
      <div className="tool-item">
        <span style={{ cursor: 'pointer' }} onClick={this.handleClick}>
          {nodeType === EditorCommand.insertChildNode ? '新增子节点' : '新增兄弟节点'}
        </span>
      </div>
    )
  }
}

// 插入节点插件
const InsertItemPlugin = (ctx: ILowCodePluginContext, options: { model: any }) => {
  const nodeType = [EditorCommand.insertChildNode, EditorCommand.insertSiblingNode]
  return {
    name: 'insertItem',
    async init() {
      const { skeleton } = ctx
      nodeType.forEach((item) => {
        console.log('alex', item)
        skeleton.add({
          name: item,
          area: 'toolbar',
          type: 'Widget',
          props: {
            align: 'left',
          },
          content: InsertView,
          contentProps: {
            ctx,
            model: options.model,
            nodeType: item,
          },
        })
        hotkey.bind(item === EditorCommand.insertChildNode ? 'tab' : 'enter', (e: any) => {
          e.preventDefault()
          const selectedNodes = ctx.project.currentDocument?.selection.getNodes()
          const { model } = options
          if (selectedNodes && selectedNodes.length > 0) {
            // 有选中节点触发
            ctx.event.emit(item, { selectedNodes, model })
          }
        })
      })
    },
  }
}

InsertItemPlugin.pluginName = 'insertItemPlugin'
InsertItemPlugin.meta = {
  preferenceDeclaration: {
    title: '新增节点配置',
    properties: [
      {
        key: 'model',
        type: 'any',
        description: '用户自定义新增节点配置',
      },
    ],
  },
}

export default InsertItemPlugin
