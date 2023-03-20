import * as React from 'react';
import { Button } from '@alifd/next';
import { project } from '@alilc/lowcode-engine';

interface IProps {
}

export default class UndoRedoPane extends React.Component<IProps> {
  onUndo = () => {
    console.log(this.props);
    project.currentDocument?.history.back();
  }

  onRedo = () => {
    project.currentDocument?.history.forward();
  }

  render() {
    return (
      <div className='undo-redo-pane'>
        <div onClick={this.onUndo}>撤销</div>
        <div onClick={this.onRedo}>恢复</div>
      </div>
    )
  }
}