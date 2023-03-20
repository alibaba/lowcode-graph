import React, { PureComponent } from 'react';
import { hotkey } from '@alilc/lowcode-engine';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { EditorCommand } from '../common';

interface IUndoRedoProps {
  ctx: IPublicModelPluginContext; // 上下文
  mode: string;
}

// 缩放渲染
class UndoRedoView extends PureComponent<IUndoRedoProps> {
  handleClick = () => {
    const { ctx, mode } = this.props;
    ctx.event.emit(mode === 'undo' ? EditorCommand.Undo : EditorCommand.Redo);
  }

  render() {
    const { mode } = this.props;
    return (
      <div className="tool-item">
        <span style={{ cursor: 'pointer' }} onClick={this.handleClick}>
          {mode === 'undo' ? '撤销' : '恢复'}
        </span>
      </div>
    );
  }
}

// 缩放插件
const UndoRedoPlugin = (ctx: IPublicModelPluginContext) => {
  return {
    name: 'zoom',
    async init() {
      const { skeleton } = ctx;
      const modes = ['undo', 'redo'];
      modes.forEach((item) => {
        skeleton.add({
          name: item,
          area: 'toolbar',
          type: 'Widget',
          props: {
            align: 'left',
          },
          content: UndoRedoView,
          contentProps: {
            ctx,
            mode: item,
          },
        })
        // 绑定快捷键
        const key = item === 'undo' ? 'command+z' : 'command+y';
        hotkey.bind(key, (e: any) => {
          e.preventDefault()
          ctx.event.emit(item === 'undo' ? EditorCommand.Undo : EditorCommand.Redo)
        })
      })
    },
  }
}

UndoRedoPlugin.pluginName = 'undoRedoPlugin';

export default UndoRedoPlugin;
