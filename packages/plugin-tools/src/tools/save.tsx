import React from 'react';
import { ILowCodePluginContext, hotkey } from '@alilc/lowcode-engine';
import { Button } from '@alifd/next';

class Save extends React.Component<{ ctx: ILowCodePluginContext, cb: any, type: 'save' | 'publish' }, any> {
  handleSave() {
    const { ctx, cb } = this.props;
    const currentSchema = ctx.project.currentDocument?.exportSchema();
    cb(currentSchema);
  }
  render() {
    const { type } = this.props;
    return (
      <Button type={type === 'save' ? 'primary' : 'normal'} onClick={this.handleSave.bind(this)}>{type === 'save' ? '保存' : '发布'}</Button>
    )
  }
}

export const save = (ctx: ILowCodePluginContext, options: any) => {
  return {
    name: 'save',
    async init() {
      const { skeleton } = ctx;

      skeleton.add({
        name: 'save',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right'
        },
        content: Save,
        contentProps: {
          ctx,
          cb: options.cb,
          type: 'save'
        }
      });
    }
  };
};
save.pluginName = 'save';
save.meta = {
  preferenceDeclaration: {
    title: '保存回调',
    properties: [{
      key: 'cb',
      type: 'Function',
      description: '用户自定义保存处理',
    }]
  }
};

export const saveHotKey = (ctx: ILowCodePluginContext, options: any) => {
  return {
    name: 'saveHotKey',
    async init() {
      hotkey.bind('command+s', (e: any) => {
        e.preventDefault();
        const currentSchema = ctx.project.currentDocument?.exportSchema();
        options.cb(currentSchema);
      });
    }
  };
};
saveHotKey.pluginName = 'saveHotKey';
saveHotKey.meta = {
  preferenceDeclaration: {
    title: '保存快捷键回调',
    properties: [{
      key: 'cb',
      type: 'Function',
      description: '用户自定义保存快捷键回调',
    }]
  }
};

export const publish = (ctx: ILowCodePluginContext, options: any) => {
  return {
    name: 'publish',
    async init() {
      const { skeleton } = ctx;

      skeleton.add({
        name: 'publish',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right'
        },
        content: Save,
        contentProps: {
          ctx,
          cb: options.cb,
          type: 'publish'
        }
      });
    }
  };
};
publish.pluginName = 'publish';
publish.meta = {
  preferenceDeclaration: {
    title: '发布回调',
    properties: [{
      key: 'cb',
      type: 'Function',
      description: '用户自定义发布处理',
    }]
  }
};