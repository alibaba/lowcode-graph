import { ILowCodePluginContext, project } from '@alilc/lowcode-engine';
import DesignerView from './DesignerView';
// import MaterialPane from './MaterialPane';
import { rootState } from './items/state';
import g6Designer, { G6Designer } from './designer';

export interface IOptions {
  type: 'tree' | 'graph',
  graphConfig: any,
  layoutConfig: any
}

/**
 * plugin G6 designer
 * @param ctx 
 * @returns 
 */
const PluginG6Designer = (
  ctx: ILowCodePluginContext,
  options: IOptions = {
    type: 'tree',
    graphConfig: {},
    layoutConfig: {}
  }) => {
  return {
    exports() {
      return g6Designer;
    },
    init() {
      const { skeleton, project } = ctx;
      skeleton.remove({
        name: 'designer',
        area: 'mainArea',
        type: 'Widget'
      });
      skeleton.add({
        area: 'mainArea',
        name: 'designer',
        type: 'Widget',
        content: DesignerView,
        contentProps: {
          ctx,
          ...options
        }
      });
      // bind nodes state
      rootState.init(project.currentDocument, options.type);
      project.onChangeDocument((doc) => {
        rootState.disposeDocumentEvent();
        rootState.init(project.currentDocument, options.type);
      });
    }
  }
}

PluginG6Designer.pluginName = 'plugin-g6-designer';
PluginG6Designer.meta = {
  preferenceDeclaration: {
    title: 'g6图类型',
    properties: [
      {
        key: 'type',
        type: 'string',
        description: '用户自定义g6图类型',
      },
      {
        key: 'graphConfig',
        type: 'any',
        description: '图配置'
      },
      {
        key: 'layoutConfig',
        type: 'any',
        description: '布局配置'
      }
    ]
  }
};
export default PluginG6Designer;
export { G6Designer };
