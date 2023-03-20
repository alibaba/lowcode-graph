import { Node } from '@antv/x6';
import { Node as NodeModel } from '@alilc/lowcode-shell';
import { material } from '@alilc/lowcode-engine';
import { get } from 'lodash';

export const getComponentView = (nodeModel: NodeModel) => {
  const { componentName } = nodeModel;
  const global: any = window;
  const assets = material.getAssets();
  const componentMeta = material.getComponentMeta(componentName);

  if (!componentMeta || !componentMeta.npm) {
    console.error(`${componentName} is not a npm component`);
    return null;
  }

  const { package: componentPackage, destructuring, exportName } = componentMeta.npm;

  const library = assets.packages.find((item: any) => item.package === componentPackage).library;

  if (!library) {
    console.error(`${componentName} library is not defined`);
    return null;
  }

  if (destructuring && exportName) {
    return typeof global[library][exportName] === 'function' ? global[library][exportName]() : global[library][exportName];
  }

  return typeof global[library] === 'function' ? global[library]() : global[library];
}

export function getPropList(model: NodeModel) {
  const configure = model.componentMeta?.configure;

  if (!Array.isArray(configure)) {
    return [];
  }

  const props = configure.find(item => item.name === '#props');

  if (!Array.isArray(props?.items)) {
    return [];
  }

  const propsData = model.propsData || {};

  return props?.items?.map(item => {
    const value = get(propsData, item.name) ?? item.defaultValue;
    return {
      name: item.name,
      value,
    };
  });
}

export function updateNodeProps(model: NodeModel, node: Node) {
  const propList = getPropList(model) || [];
  propList.forEach(item => {
    node.prop(item.name, item.value);
  });
}