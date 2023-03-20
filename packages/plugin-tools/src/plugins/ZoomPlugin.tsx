import React, { PureComponent } from 'react';
import { ILowCodePluginContext, hotkey } from '@alilc/lowcode-engine';
import { EditorCommand } from '../common';

interface IZoomProps {
  ctx: ILowCodePluginContext; // 上下文
  mode: string;
}

// 缩放渲染
class ZoomView extends PureComponent<IZoomProps> {
  handleClick = () => {
    const { ctx, mode } = this.props;
    ctx.event.emit(mode === 'zoom-in' ? EditorCommand.ZoomIn : EditorCommand.ZoomOut);
  }

  render() {
    const { mode } = this.props;
    return (
      <div className="tool-item">
        <span style={{ cursor: 'pointer' }} onClick={this.handleClick}>
          {mode === 'zoom-in' ? '放大' : '缩小'}
        </span>
        {/* <Icon type="zoom-in"  /> */}
      </div>
    );
  }
}

// 缩放插件
const ZoomPlugin = (ctx: ILowCodePluginContext) => {
  return {
    name: 'zoom',
    async init() {
      const { skeleton } = ctx
      const modes = ['zoom-in', 'zoom-out']
      modes.forEach((item) => {
        skeleton.add({
          name: item,
          area: 'toolbar',
          type: 'Widget',
          props: {
            align: 'left',
          },
          content: ZoomView,
          contentProps: {
            ctx,
            mode: item,
          },
        })
        // 绑定快捷键
        const key = item === 'zoom-in' ? 'command+1' : 'command+2';
        hotkey.bind(key, (e: any) => {
          e.preventDefault()
          ctx.event.emit(item === 'zoom-in' ? EditorCommand.ZoomIn : EditorCommand.ZoomOut)
        })
      })
    },
  }
}

ZoomPlugin.pluginName = 'zoomPlugin';

export default ZoomPlugin;
