import React from 'react';
import { ILowCodePluginContext, hotkey } from '@alilc/lowcode-engine';
import { isFormEvent } from '@alilc/lowcode-utils';
import { EditorCommand } from '../common';

class Tool extends React.Component<{ ctx: ILowCodePluginContext }, any> {
  handleClick() {
    const { ctx } = this.props;
    const selectedNodes = ctx.project.currentDocument?.selection.getNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      // 有选中节点触发
      ctx.event.emit(EditorCommand.removeItem, selectedNodes);
    }
  }
  render() {
    return (
      <div onClick={this.handleClick.bind(this)} className="tool-item" style={{ width: 80 }}>
        删除节点
      </div>
    )
  }
}

export const removeItem = (ctx: ILowCodePluginContext) => {
  return {
    name: 'removeItem',
    async init() {
      const { skeleton } = ctx;

      skeleton.add({
        name: 'removeItem',
        area: 'toolbar',
        type: 'Widget',
        props: {
          align: 'left'
        },
        content: Tool,
        contentProps: {
          ctx
        }
      });
    },
  };
};
removeItem.pluginName = 'removeItem';

export const removeItemHotKey = (ctx: ILowCodePluginContext, options: any) => {
  const onRemove = (e: any) => {
    if (isFormEvent(e)) return;
    const selectedNodes = ctx.project.currentDocument?.selection.getNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      // 有选中节点触发
      ctx.event.emit(EditorCommand.removeItem, selectedNodes);
    }
  }
  return {
    name: 'removeItemHotKey',
    async init() {
      hotkey.bind(['backspace', 'del'], (e) => {
        onRemove(e);
      });
    }
  };
};
removeItemHotKey.pluginName = 'removeItemHotKey';