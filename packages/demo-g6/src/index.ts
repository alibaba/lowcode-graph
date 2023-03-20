import { plugins, init as _init } from '@alilc/lowcode-engine';
import PluginG6Designer from '@alilc/lce-graph-g6-designer';
import {
  logo,
  InsertItemPlugin,
  OperateButtonPlugin,
  ZoomPlugin,
  RemoveItemPlugin,
  UndoRedoPlugin
} from '@alilc/lce-graph-tools';
import ToolDemo from './tools/tool-demo';
import PluginCore from '@alilc/lce-graph-core';
import assets from './static/assets.json';
import schema from './static/schema.json';

(async function main() {
  // 新增节点数据模型
  const newNodeModel = {
    componentName: 'DemoNode',
    props: {
      collapsed: false,
      type: 'default-shape',
      itemColor: 'default',
    },
  }

  // 核心插件
  await plugins.register(PluginCore, {
    assets,
    schema
  });

  await plugins.register(PluginG6Designer, {
    type: 'tree',
    behaviors: [],
    graphConfig: [],
    layoutConfig: {
      compactBox: {
        direction: 'TB',
      }
    }
  });

  // tools
  await plugins.register(logo);
  await plugins.register(ZoomPlugin);
  await plugins.register(RemoveItemPlugin);
  await plugins.register(OperateButtonPlugin, [
    {
      callback: (schema: any) => {
        console.log('保存回调', schema)
      },
      name: 'save',
      text: '保存',
      hotkey: 'command+s',
    },
    {
      callback: (schema: any) => {
        console.log('发布回调', schema)
      },
      name: 'publish',
      text: '发布',
      hotkey: 'command+p',
    },
    {
      callback: (schema: any) => {
        console.log('自定义操作按钮回调', schema)
      },
      name: 'test',
      text: '测试自定义按钮',
      hotkey: 'command+0',
      btnProps: { type: 'secondary' },
    },
  ]);

  await plugins.register(InsertItemPlugin, {
    model: newNodeModel
  });
  await plugins.register(UndoRedoPlugin);
  // 自定义插件
  await plugins.register(ToolDemo);

  _init();
})();
