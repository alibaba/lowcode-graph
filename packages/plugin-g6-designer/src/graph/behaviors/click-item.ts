import { isEdge, getGraphState, clearSelectedState } from '../utils';
import { ItemState, GraphState, EditorEvent } from '@alilc/lce-graph-tools';
import { Behavior } from '../interfaces';
import * as G6 from '@antv/g6';
import { get } from 'lodash';
import { rootState } from '../../items/state';

export interface ClickItemBehavior extends Behavior {
  /** 处理点击事件 */
  handleItemClick({ item }: { item: G6.Item }): void;
  /** 处理画布点击 */
  handleCanvasClick(): void;
  /** 处理按键按下 */
  handleKeyDown(e: KeyboardEvent): void;
  /** 处理按键抬起 */
  handleKeyUp(e: KeyboardEvent): void;
}

export interface DefaultConfig {
  /** 是否支持多选 */
  multiple: boolean;
  /** 是否按下多选 */
  keydown: boolean;
  /** 多选按键码值 */
  keyCode: number;
}

const clickItemBehavior: ClickItemBehavior & ThisType<ClickItemBehavior & DefaultConfig> = {
  getDefaultCfg(): DefaultConfig {
    return {
      multiple: true,
      keydown: false,
      keyCode: 16,
    };
  },

  getEvents() {
    return {
      'node:click': 'handleItemClick',
      'edge:click': 'handleItemClick',
      'canvas:click': 'handleCanvasClick',
      keydown: 'handleKeyDown',
      keyup: 'handleKeyUp',
    };
  },

  handleItemClick(e) {
    const eleName = get(e, 'target.attrs.name');
    if (eleName === 'collapse') return;
    const { item } = e;
    if (isEdge(item)) {
      return;
    }
    const nodeId = item.get('id');
    const isSelected = item && item.hasState(ItemState.Selected);
    if (this.multiple && this.keydown) {
      const currentSelected = rootState.selected;
      if (isSelected) {
        rootState.setSelected(currentSelected.filter(itemId => itemId !== nodeId));
      } else {
        rootState.setSelected(currentSelected.concat(nodeId));
      }
    } else {
      if (isSelected) {
        rootState.setSelected([]);
      } else {
        rootState.setSelected([nodeId]);
      }
    }
  },

  handleCanvasClick() {
    const { graph } = this;
    clearSelectedState(graph!);
    rootState.setSelected([]);
  },

  handleKeyDown(e) {
    this.keydown = (e.keyCode || e.which) === this.keyCode;
  },

  handleKeyUp() {
    this.keydown = false;
  },
};

export default {
  config: clickItemBehavior,
  name: 'click-item'
};
