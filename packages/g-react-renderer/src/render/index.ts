import renderNode from './elements/renderNode';

const renderShape = (gContainerGroup: any) => (shape: any) => {
    // create parent group
    const shapeGroup = gContainerGroup.addGroup();
    const elements = shape.children || [];
    elements.forEach(renderNode(shapeGroup));
};

const render = (gContainerGroup: any, shape: any) => {
    renderShape(gContainerGroup)(shape);
    return gContainerGroup;
};

export default render;
