import React, {Component} from 'react';
import {Button} from 'library';

class AddComponent extends Component {
  constructor(props) {
    super(props);
    this.setComponent = this.setComponent.bind(this);
  }

  setComponent() {
    this.props.addComponent(this.props.name)
  }

  render() {
    var type = 'outline-dark';

    return (
      <div>
      <Button onClick={this.setComponent} text={this.props.name.name} type={type}/>
      </div>
    )
  }
}

export default AddComponent;
