import React, { Component } from 'react';

class DisplayInstance extends Component {
  constructor(props) {
    super(props);
    this.setComponent = this.setComponent.bind(this);
  }

  setComponent() {
      this.props.setComponent(this.props.index)
  }

  render() {

    var child_component = React.cloneElement(this.props.content, this.props)

    return (
      <div onClick={this.setComponent} style={this.props.style}>
        {child_component}
      </div>
    )
  }
}

export default DisplayInstance;
