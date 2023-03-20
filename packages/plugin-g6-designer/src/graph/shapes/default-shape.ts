const defaultShape = {
  config: {
    draw(model: any, group: any) {
      const { size = [300, 180] } = model || {};
      const keyShape = group.addShape('rect', {
        attrs: {
          width: size[0] - 8, // 内部有margin10
          height: size[1] - 8,
          name: 'key-shape',
          fill: '#fff',
          radius: 6
        },
        className: 'wrapper-border',
      });
      const gRenderer = (window as any).gRendererMaps[model.id];
      gRenderer && gRenderer.render(group);
      group.sort();

      return keyShape;
    },

    update(model: any, item: any) {
      const gRenderer = (window as any).gRendererMaps[model.id];
      const group = item.getContainer();
      gRenderer && gRenderer.update(group);
      const wrapper = group.findByClassName('wrapper-border');
      wrapper && wrapper.attr({
        width: model.width,
        height: model.height
      });
    }
  },
  name: 'default-shape',
};
export default defaultShape;
