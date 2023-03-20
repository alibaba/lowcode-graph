import * as React from 'react';
import { Button } from '@alifd/next';
import { project } from '@alilc/lowcode-engine';

export default class SaveSchema extends React.Component {
  onClick = () => {
    const schema = project.currentDocument!.exportSchema();
    console.log(schema);
  }

  render() {
    return <Button onClick={this.onClick}>Save Schema</Button>
  }
}