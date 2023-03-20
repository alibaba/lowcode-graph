import { get } from 'lodash';
import { Behavior } from '../interfaces';
import * as G6 from '@antv/g6';
import { rootState } from '../../items/state';

export interface HoverItemBehavior extends Behavior {
  /** 处理鼠标进入 */
  handleItemMouseenter({ item }: { item: G6.Item }): void;
  /** 处理鼠标移出 */
  handleItemMouseleave({ item }: { item: G6.Item }): void;
}

const hoverItemBehavior: HoverItemBehavior = {
  getEvents() {
    return {
      'node:mouseenter': 'handleItemMouseenter',
      'edge:mouseenter': 'handleItemMouseenter',
      'node:mouseleave': 'handleItemMouseleave',
      'edge:mouseleave': 'handleItemMouseleave',
    };
  },

  handleItemMouseenter(e) {
    const eleName = get(e, 'target.attrs.name');
    if (eleName === 'collapse') return;
    const { item } = e;
    rootState.setHovered(item.get('id'));
  },

  handleItemMouseleave() {
    rootState.setHovered('');
  },
};

export default {
  config: hoverItemBehavior,
  name: 'hover-item'
}
