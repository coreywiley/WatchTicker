import React, {Component} from 'react';
import {Button} from 'library';

class ComponentInstance extends Component {
  constructor(props) {
    super(props);
    this.setComponent = this.setComponent.bind(this);
  }

  setComponent() {
    this.props.setComponent(this.props.index)
  }

  render() {
    var type = 'outline-dark';

    if (this.props.selectedComponent == this.props.index) {
      type = 'primary'
    }

    if (this.props.name) {
        return (
          <div>
            <Button onClick={this.setComponent} text={this.props.name.name + ' : ' + this.props.index} type={type}/>
          </div>
        )
    }
    else {
        return (null)
    }

  }
}

export default ComponentInstance;
