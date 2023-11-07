import { ILowCodePluginContext, project } from '@alilc/lowcode-engine';
import DesignerView from './DesignerView';
import { RootState } from './items/state';
import type { IDesigner } from './designer';
import { Designer } from './designer';
import '@antv/x6-react-shape'; // 支持自定义 react 组件

/**
 * plugin X6 designer
 * @param ctx 
 * @returns 
 */
const PluginX6Designer = (ctx: ILowCodePluginContext, options:any = {}) => {
  const x6Designer = new Designer();
  const rootState = new RootState();

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
        content: <DesignerView editor={ctx.editor} ctx={ctx} graphConfig={options.graphConfig || {}} designer={x6Designer} rootState={rootState}/>,
        contentProps: {
          ctx,
        }
      });

      console.log('[PluginInit]ctx', ctx);
      // bind nodes state
      rootState.bindNodes(project.currentDocument);

      console.log('[PluginInit]windowId', ctx.workspace.window.id, );

      project.onChangeDocument((doc) => {
        rootState.disposeDocumentEvent();
        rootState.bindNodes(project.currentDocument);
      });
    }
  }
}

PluginX6Designer.pluginName = `plugin-x6-designer`;
export  { PluginX6Designer };
export type { IDesigner };
