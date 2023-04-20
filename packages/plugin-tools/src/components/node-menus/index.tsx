/**
 * 节点菜单
 */
import React, { Component, PureComponent } from 'react';
import cls from 'classnames';
import { ILowCodePluginContext } from '@alilc/lowcode-engine';
import { EditorCommand } from '../../common';

import { IMenuItem, IPosition, IUpdateProps } from './typing';
//
import styles from './index.module.scss';

interface IProps {
  className?: string;
  menuClassName?: string;
  ctx: ILowCodePluginContext;
  visible?: boolean;
  menus?: IMenuItem[];
  position?: IPosition,
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onClickMenuItem?: (option: IMenuItem, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

interface IMenusProps {
  className?: string;
  menus: IMenuItem[];
  onClickMenuItem: (option: IMenuItem, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

interface IState {
  className?: string;
  menuClassName?: string;
  visible?: boolean;
  menus?: IMenuItem[];
  position?: IPosition;
}

/**
 * 菜单列表
 */
class Menus extends PureComponent<IMenusProps> {
  render() {
    const {
      className,
      menus,
      onClickMenuItem,
    } = this.props;
    return (
      <div className={cls('menus-container-comps', className || '', styles.container)}>
        <div className={styles.list}>
          {
            menus.map(item => (
              <div
                key={item.id}
                className={cls({
                  [styles.item]: true,
                  [styles.displayNone]: item.hidden,
                })}
                onClick={(e) => onClickMenuItem(item, e)}
              >
                {item.label}
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

class NodeMenusComps extends Component<IProps> {
  state: IState;

  constructor(props: IProps) {
    super(props);
    const {
      className,
      menuClassName,
      visible,
      menus = [],
      position,
    } = this.props;
    this.state = {
      className,
      menuClassName,
      visible,
      menus,
      position,
    };
  }

  componentDidMount() {
    // 监听更新状态
    const { ctx } = this.props;
    ctx.event.on('common:onNodeMenusUpdateState', this.updateState);
  }

  componentWillUnmount() {
    // 取消监听更新状态
    const { ctx } = this.props;
    ctx.event.off('common:onNodeMenusUpdateState', this.updateState);
  }

  /**
   * 组件内移动鼠标
   * @param e 鼠标事件
   */
  onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.props.onMouseMove && this.props.onMouseMove(e);
    const { ctx } = this.props;
    ctx.event.emit(EditorCommand.onNodeMenusMouseMove, e);
  }

  /**
   * 组件内移出鼠标
   * @param e 鼠标事件
   */
  onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.props.onMouseLeave && this.props.onMouseLeave(e);
    const { ctx } = this.props;
    ctx.event.emit(EditorCommand.onNodeMenusMouseLeave, e);
  }

  /**
   * 选择某项菜单
   * @param option 菜单项
   * @param e 鼠标事件
   */
  onClickMenuItem = (option: IMenuItem, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.props.onClickMenuItem && this.props.onClickMenuItem(option, e);
    const { ctx } = this.props;
    ctx.event.emit(EditorCommand.onNodeMenusClickMenuItem, option, e);
  }

  /**
   * 更新组件状态，可以更新的状态有：menus、position
   * @param props 更新的数据
   */
  updateState = (props: IUpdateProps = {}) => {
    const obj = {};
    if (props.hasOwnProperty('menus') && Array.isArray(props.menus)) {
      Object.assign(obj, {
        menus: props.menus,
      });
    }
    if (props.hasOwnProperty('position')) {
      Object.assign(obj, {
        position: props.position,
      });
    }
    this.setState(obj)
  }

  /**
   * 隐藏组件
   */
  hide = () => {
    this.setState({
      visible: false,
    })
  }

  /**
   * 显示组件
   */
  show = () => {
    this.setState({
      visible: true,
    })
  }

  /**
   * 获取组件状态, 可以获取的状态有：visible、menus、position
   * @param keys 获取状态的 key
   * @returns 返回获取的状态
   */
  getState = (keys: string | string[]) => {
    const { state } = this;
    const obj: {
      visible?: boolean;
      menus?: IMenuItem[];
      position?: IPosition;
    } = {};
    // 如果类型不对，则直接返回
    if (!Array.isArray(keys) || typeof keys !== 'string') return obj;
    const keysArr = Array.isArray(keys) ? keys : [keys];
    keysArr.forEach(key => {
      if (['visible', 'menus', 'position'].includes(key)) {
        Object.assign(obj, {
          [key]: state[key as keyof IState],
        });
      }
    });
    return obj;
  }

  render() {
    return (
      this.state.visible ? (
        <div
          className={cls('node-menus-comps', this.state.className || '', styles.cardMenus)}
          style={
            this.state.position ? {
              top: this.state.position.top,
              left: this.state.position.left,
            } : {}
          }
          onMouseMove={(e) => this.onMouseMove(e)}
          onMouseLeave={e => this.onMouseLeave(e)}
        >
          {
            this.state.menus && this.state.menus.length > 0 && (
              <Menus
                className={this.state.menuClassName}
                menus={this.state.menus}
                onClickMenuItem={this.onClickMenuItem}
              />
            )
          }
        </div>
      ) : null
    );
  }
}

const NodeMenusPlugin = (ctx: ILowCodePluginContext) => {
  return {
    name: 'node-menus',
    async init() {
      const { skeleton } = ctx
      skeleton.add({
        name: 'node-menus',
        area: 'mainArea',
        type: 'Widget',
        props: {
          align: 'left',
        },
        content: NodeMenusComps,
        contentProps: {
          ctx,
          menus: [],
          onClickMenuItem: () => { },
        },
      })
    },
  }
}

NodeMenusPlugin.pluginName = 'nodeMenusPlugin';

export default NodeMenusPlugin;
