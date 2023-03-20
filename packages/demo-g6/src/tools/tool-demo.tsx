import React from 'react';
import { ILowCodePluginContext } from '@alilc/lowcode-engine';
import { G6Designer } from '@alilc/lce-graph-g6-designer';
class Tool extends React.Component<{ ctx: ILowCodePluginContext }, any> {
  handleClick() {
    const { ctx } = this.props;
    // 触发自定义命令
    ctx.event.emit('toolDemoEvent', '我是自定义工具信息');
  }
  render() {
    return (
      <div onClick={this.handleClick.bind(this)} className="tool-item">
        测试自定义工具
      </div>
    )
  }
}

const ToolDemo = (ctx: ILowCodePluginContext) => {
  return {
    name: 'toolDemo',
    async init() {
      const { skeleton, plugins } = ctx;
      const g6Designer = plugins['plugin-g6-designer'] as G6Designer;
      // 实现命令回调
      g6Designer.registerCommand('toolDemoEvent', (ctx, graph, data) => { alert(data) });
      skeleton.add({
        name: 'toolDemo',
        area: 'toolbar',
        type: 'Widget',
        props: {
          align: 'left'
        },
        content: Tool,
        contentProps: {
          ctx
        },
      });
    },
  };
};
ToolDemo.pluginName = 'toolDemo';

export default ToolDemo;