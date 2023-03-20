import React from 'react';
import { ILowCodePluginContext } from '@alilc/lowcode-engine';
import { EditorCommand } from '../common';


class Tool extends React.Component<{ ctx: ILowCodePluginContext }, any> {
  handleClick() {
    const { ctx } = this.props;
    ctx.event.emit(EditorCommand.ZoomOut);
  }
  render() {
    return (
      <div onClick={this.handleClick.bind(this)} className="tool-item">
        缩小
      </div>
    )
  }
}

export const zoomOut = (ctx: ILowCodePluginContext) => {
  return {
    name: 'zoomOut',
    async init() {
      const { skeleton } = ctx;

      skeleton.add({
        name: 'zoomOut',
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
zoomOut.pluginName = 'zoomOut';