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

    var style = this.props.style;
    var passedData = {...this.props};
    delete passedData['style']
    var child_component = React.cloneElement(this.props.content, passedData)

    return (child_component)
  }
}

export default DisplayInstance;
