import React, { PureComponent } from 'react';
import { ILowCodePluginContext, hotkey } from '@alilc/lowcode-engine';
import { isFormEvent } from '@alilc/lowcode-utils';
import { EditorCommand } from '../common';

interface IRemoveProps {
  ctx: ILowCodePluginContext // 上下文
  mode: string
}

// 删除渲染
class RemoveView extends PureComponent<IRemoveProps> {
  handleClick = () => {
    const { ctx } = this.props
    const selectedNodes = ctx.project.currentDocument?.selection.getNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      // 有选中节点触发
      ctx.event.emit(EditorCommand.removeItem, selectedNodes)
    }
  }

  render() {
    return (
      <div className="tool-item">
        <span style={{ cursor: 'pointer' }} onClick={this.handleClick}>
          删除
        </span>
      </div>
    )
  }
}

// 删除节点插件
const RemoveItemPlugin = (ctx: ILowCodePluginContext) => {
  const onRemove = (e: any) => {
    if (isFormEvent(e)) return;
    const selectedNodes = ctx.project.currentDocument?.selection.getNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      // 有选中节点触发
      ctx.event.emit(EditorCommand.removeItem, selectedNodes);
    }
  }
  return {
    name: 'removeItem',
    async init() {
      const { skeleton } = ctx
      skeleton.add({
        name: 'removeItem',
        area: 'toolbar',
        type: 'Widget',
        props: {
          align: 'left',
        },
        content: RemoveView,
        contentProps: {
          ctx,
        },
      });
      hotkey.bind(['backspace', 'del'], (e) => {
        onRemove(e);
      });
    },
  }
}

RemoveItemPlugin.pluginName = 'removeItemPlugin'

export default RemoveItemPlugin
