import React from 'react';
import { ILowCodePluginContext, hotkey } from '@alilc/lowcode-engine';
import { EditorCommand } from '../common';

class Tool1 extends React.Component<{ ctx: ILowCodePluginContext, model: any }, any> {
  handleClick() {
    const { ctx, model } = this.props;
    const selectedNodes = ctx.project.currentDocument?.selection.getNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      // 有选中节点触发
      ctx.event.emit(EditorCommand.insertChildNode, { selectedNodes, model });
    }
  }
  render() {
    return (
      <div onClick={this.handleClick.bind(this)} className="tool-item" style={{ width: 80 }}>
        insertChild
      </div>
    )
  }
}

export const insertChild = (ctx: ILowCodePluginContext, options: { model: any }) => {
  return {
    name: 'insertChild',
    async init() {
      const { skeleton } = ctx;
      skeleton.add({
        name: 'insertChild',
        area: 'toolbar',
        type: 'Widget',
        props: {
          align: 'left'
        },
        content: Tool1,
        contentProps: {
          ctx,
          ...options
        }
      });
    },
  };
};
insertChild.pluginName = 'insertChild';
insertChild.meta = {
  preferenceDeclaration: {
    title: '新增节点配置',
    properties: [{
      key: 'model',
      type: 'any',
      description: '用户自定义新增节点配置',
    }]
  }
};

export const insertChildHotKey = (ctx: ILowCodePluginContext, options: any) => {
  return {
    name: 'insertChildHotKey',
    async init() {
      hotkey.bind('tab', (e: any) => {
        e.preventDefault();
        const selectedNodes = ctx.project.currentDocument?.selection.getNodes();
        const { model } = options;
        if (selectedNodes && selectedNodes.length > 0) {
          // 有选中节点触发
          ctx.event.emit(EditorCommand.insertChildNode, { selectedNodes, model });
        }
      });
    }
  };
};
insertChildHotKey.pluginName = 'insertChildHotKey';
insertChildHotKey.meta = {
  preferenceDeclaration: {
    title: '新增节点配置',
    properties: [{
      key: 'model',
      type: 'any',
      description: '用户自定义新增节点配置',
    }]
  }
};


class Tool2 extends React.Component<{ ctx: ILowCodePluginContext, model: any }, any> {
  handleClick() {
    const { ctx, model } = this.props;
    const selectedNodes = ctx.project.currentDocument?.selection.getNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      // 有选中节点触发
      ctx.event.emit(EditorCommand.insertSiblingNode, { selectedNodes, model });
    }
  }
  render() {
    return (
      <div onClick={this.handleClick.bind(this)} className="tool-item" style={{ width: 80 }}>
        insertSibling
      </div>
    )
  }
}

export const insertSibling = (ctx: ILowCodePluginContext, options: { model: any }) => {
  return {
    name: 'insertSibling',
    async init() {
      const { skeleton } = ctx;

      skeleton.add({
        name: 'insertSibling',
        area: 'toolbar',
        type: 'Widget',
        props: {
          align: 'left',
          width: 80
        },
        content: Tool2,
        contentProps: {
          ctx,
          ...options
        }
      });
    },
  };
};
insertSibling.pluginName = 'insertSibling';
insertSibling.meta = {
  preferenceDeclaration: {
    title: '新增节点配置',
    properties: [{
      key: 'model',
      type: 'any',
      description: '用户自定义新增节点配置',
    }]
  }
};

export const insertSiblingHotKey = (ctx: ILowCodePluginContext, options: any) => {
  return {
    name: 'insertSiblingHotKey',
    async init() {
      hotkey.bind('enter', (e: any) => {
        e.preventDefault();
        const selectedNodes = ctx.project.currentDocument?.selection.getNodes();
        const { model } = options;
        if (selectedNodes && selectedNodes.length > 0) {
          // 有选中节点触发
          ctx.event.emit(EditorCommand.insertSiblingNode, { selectedNodes, model });
        }
      });
    }
  };
};
insertSiblingHotKey.pluginName = 'insertSiblingHotKey';
insertSiblingHotKey.meta = {
  preferenceDeclaration: {
    title: '新增节点配置',
    properties: [{
      key: 'model',
      type: 'any',
      description: '用户自定义新增节点配置',
    }]
  }
};