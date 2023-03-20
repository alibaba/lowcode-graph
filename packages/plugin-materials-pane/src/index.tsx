import * as React from "react";
import { IPublicModelPluginContext } from "@alilc/lowcode-types";
import Pane from "./pane";

const Icon = <svg t="1672300452888" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1413" width="32" height="32"><path d="M768 928H128a32 32 0 0 1-32-32V256a32 32 0 0 1 32-32h195.84A132.48 132.48 0 0 1 320 192a128 128 0 0 1 256 0 132.48 132.48 0 0 1-3.84 32H768a32 32 0 0 1 32 32v195.84A132.48 132.48 0 0 1 832 448a128 128 0 0 1 0 256 132.48 132.48 0 0 1-32-3.84V896a32 32 0 0 1-32 32z m-608-64h576v-216.96a32.64 32.64 0 0 1 19.2-29.44 32.64 32.64 0 0 1 33.92 5.76 64 64 0 1 0 0-94.72 31.36 31.36 0 0 1-33.92 5.76 32.64 32.64 0 0 1-19.2-29.44V288H519.04a32.64 32.64 0 0 1-29.44-19.2 31.36 31.36 0 0 1 5.76-33.92 64 64 0 1 0-94.72 0 31.36 31.36 0 0 1 5.76 33.92 32.64 32.64 0 0 1-29.44 19.2H160z" fill="#4D4D4D" p-id="1414"></path></svg>
const PluginMaterialsPane = (ctx: IPublicModelPluginContext) => {
  return {
    // 插件名，注册环境下唯一
    name: "LclaActionsPane",
    // 依赖的插件（插件名数组）
    dep: [],
    // 插件对外暴露的数据和方法
    exports() {
      return {
        data: "你可以把插件的数据这样对外暴露",
        func: () => {
          console.log("方法也是一样");
        },
      };
    },
    // 插件的初始化函数，在引擎初始化之后会立刻调用
    init() {
      // material.setAssets(AssetsJson);
      // 你可以拿到其他插件暴露的方法和属性
      // const { data, func } = ctx.plugins.pluginA;
      // func();
      ctx.skeleton.add({
        name: "logicActionPane",
        area: "leftArea",
        type: "PanelDock",
        content: <Pane material={ctx.material} dragon={ctx.canvas.dragon} project={ctx.project} event={ctx.event} />,
        props: {
          align: 'left',
          icon: Icon,
          description: "动作库",
        },
        panelProps: {
          area: 'leftFixedArea',
          floatable: true,
          hideTitleBar: false,
          title: "动作库",
          width: 192,
        },
      });

      ctx.skeleton.showPanel('logicActionPane');
    },
  };
};

PluginMaterialsPane.pluginName = 'plugin-materials-pane';

export default PluginMaterialsPane;