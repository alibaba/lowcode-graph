import * as React from "react";
import cls from "classnames/bind";
import { Animate, Icon } from "@alifd/next";
import style from "./index.module.scss";

const cx = cls.bind(style);

interface Props {
  name: string;
  children?: React.ReactElement;
}

interface State {
  expand: boolean;
}

export default class Category extends React.Component<Props, State> {
  state = {
    expand: true,
  };

  height = 0;

  handleToggle = () => {
    this.setState((state) => {
      return {
        expand: !state.expand,
      };
    });
  };

  beforeEnter = (node) => {
    this.height = node.offsetHeight;
    node.style.height = "0px";
  };

  onEnter = (node) => {
    node.style.height = `${this.height}px`;
  };

  afterEnter = (node) => {
    this.height = null;
    node.style.height = null;
  };

  beforeLeave = (node) => {
    node.style.height = `${node.offsetHeight}px`;
  };

  onLeave = (node) => {
    node.style.height = "0px";
  };

  afterLeave = (node) => {
    node.style.height = null;
  };

  render() {
    const { children, name } = this.props;
    const { expand } = this.state;
    return (
      <div className={cx("category")}>
        <div className={cx("header")} onClick={this.handleToggle}>
          <div className={cx("icon", { expand })}>
            <Icon
              type="arrow-right"
              size="small"
              style={{ color: "rgba(0,0,0,0.3)"}}
            />
          </div>
          <div className={cx("title")}>{name}</div>
        </div>
        <Animate
          animation="expand"
          beforeEnter={this.beforeEnter}
          onEnter={this.onEnter}
          afterEnter={this.afterEnter}
          beforeLeave={this.beforeLeave}
          onLeave={this.onLeave}
          afterLeave={this.afterLeave}
        >
          {expand ? children : null}
        </Animate>
      </div>
    );
  }
}
