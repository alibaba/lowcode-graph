import React from 'react';
import { ILowCodePluginContext, hotkey } from '@alilc/lowcode-engine';
import { EditorCommand } from '../common';
class Tool extends React.Component<{ ctx: ILowCodePluginContext }, any> {
  handleClick() {
    const { ctx } = this.props;
    ctx.event.emit(EditorCommand.ZoomIn);
  }
  render() {
    return (
      <div onClick={this.handleClick.bind(this)} className="tool-item">
        放大
      </div>
    )
  }
}

export const zoomIn = (ctx: ILowCodePluginContext) => {
  return {
    name: 'zoomIn',
    async init() {
      const { skeleton } = ctx;

      skeleton.add({
        name: 'zoomIn',
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
zoomIn.pluginName = 'zoomIn';

export const zoomInHotKey = (ctx: ILowCodePluginContext, options: any) => {
  return {
    name: 'zoomInHotKey',
    async init() {
      hotkey.bind('command++', (e: any) => {
        e.preventDefault();
        ctx.event.emit(EditorCommand.ZoomIn);
      });
    }
  };
};
zoomInHotKey.pluginName = 'zoomInHotKey';