import { AssetLoader } from '@alilc/lowcode-utils';
import { ILowCodePluginContext, project, material } from '@alilc/lowcode-engine';

const PluginCore = (ctx: ILowCodePluginContext, options: any) => {
  return {
    async init() {
      const { material, project } = ctx;
      const { assets, schema } = options;
      // 注册 components，加载所有的 meta js
      await material.setAssets(assets);

      // 加载 schema
      project.openDocument(schema);

      // 简单处理 init 时候直接 load 所有组件 view
      const loader = new AssetLoader();
      const componentsAssets = assets.packages.map((asset: any) => asset.urls).flat();
      await loader.load(componentsAssets);
    },
  }
}

PluginCore.pluginName = 'PluginCore';
PluginCore.meta = {
  preferenceDeclaration: {
    title: '参数定义',
    properties: [
      {
        key: 'assets',
        type: 'object',
        description: '资产包',
      },
      {
        key: 'schema',
        type: 'object',
        description: 'schema 描述',
      },
    ],
  },
}
export default PluginCore;