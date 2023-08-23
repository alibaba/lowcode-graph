import { ILowCodePluginContext, project } from '@alilc/lowcode-engine';
import DesignerView from './DesignerView';
import { rootState } from './items/state';
import type { IDesigner } from './designer';
import { x6Designer } from './designer';
import '@antv/x6-react-shape'; // 支持自定义 react 组件

/**
 * plugin X6 designer
 * @param ctx 
 * @returns 
 */
const PluginX6Designer = (ctx: ILowCodePluginContext) => {
  return {
    exports() {
      return x6Designer;
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
        }
      });

      // bind nodes state
      rootState.bindNodes(project.currentDocument);

      project.onChangeDocument((doc) => {
        rootState.disposeDocumentEvent();
        rootState.bindNodes(project.currentDocument);
      });
    }
  }
}

PluginX6Designer.pluginName = 'plugin-x6-designer';
export  { PluginX6Designer };
export type { IDesigner };
