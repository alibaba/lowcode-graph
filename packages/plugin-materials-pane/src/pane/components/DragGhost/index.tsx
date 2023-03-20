import * as React from 'react';
import { Title } from '@alilc/lowcode-editor-core';
import { I18nData, NodeSchema } from '@alilc/lowcode-types';
import './index.scss';

type offBinding = () => any;

export default class DragGhost extends React.Component<any, any> {

  private dispose: offBinding[] = [];
  private titles: (string | I18nData | React.ReactElement)[] | null = null;
  private _dragon = this.props.dragon;
  private _material = this.props.material;

  constructor(props: any) {
    super(props);
    this.state = {
      x: 0,
      y: 0
    }
    this.dispose = [
      this._dragon.onDragstart(e => {
        if (e.originalEvent.type.slice(0, 4) === 'drag') {
          return;
        }
        this.titles = this.getTitles(e.dragObject);
        this.setState({
          x: e.globalX,
          y: e.globalY
        })
      }),
      this._dragon.onDrag(e => {
        this.setState({
          x: e.globalX,
          y: e.globalY
        })
      }),
      this._dragon.onDragend(() => {
        this.titles = null;
        this.setState({
          x: 0,
          y: 0
        })
      }),
    ];
  }

  getTitles(dragObject: any) {
    if (dragObject && dragObject.type === "node") {
      return dragObject.nodes.map((node) => node.title);
    }

    const dataList = Array.isArray(dragObject.data) ? dragObject.data : [dragObject.data];

    return dataList.map((item: NodeSchema, i) => (this._material.getComponentMeta(item.componentName).title));
  }

  componentWillUnmount() {
    if (this.dispose) {
      this.dispose.forEach(off => off());
    }
  }

  renderGhostGroup() {
    return this.titles?.map((title, i) => {
      const ghost = (
        <div className="lc-ghost" key={i}>
          <Title title={title} />
        </div>
      );
      return ghost;
    });
  }

  render() {
    if (!this.titles || !this.titles.length) {
      return null;
    }

    return (
      <div
        className="lc-ghost-group"
        style={{
          left: this.state.x,
          top: this.state.y,
        }}
      >
        {this.renderGhostGroup()}
      </div>
    );
  }
}