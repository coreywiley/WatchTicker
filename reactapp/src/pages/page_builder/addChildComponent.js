import React, {Component} from 'react';
import {ajaxWrapper} from 'functions';
import {Button, EmptyModal} from 'library';
import AddComponent from './addComponent.js';
import ComponentDict from './componentDict.js';

class AddChildComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {adding: false, building_blocks:[]}

    this.addComponent = this.addComponent.bind(this);
    this.addingComponent = this.addingComponent.bind(this);
    this.building_block_callback = this.building_block_callback.bind(this);
  }

  componentDidMount() {
      ajaxWrapper('GET', '/api/modelWebsite/page/?pagegroup=9ed43f0e-5f4e-4aa3-8303-55a4d32d3f38', {}, this.building_block_callback)
  }

  building_block_callback(result) {
      var building_blocks = []
      for (var index in result) {
          building_blocks.push(result[0]['page'])
      }
      this.setState({building_blocks: building_blocks})
  }

  addingComponent() {
    this.setState({adding: !this.state.adding})
  }

    addComponent(componentName) {
        this.props.addComponent(componentName, this.props.parentIndex)
    }

  render() {
    var addable_components = [];
    for (var key in ComponentDict) {
        var component = ComponentDict[key];
        addable_components.push(<AddComponent name={component} addComponent={this.addComponent} />);
    }

    return (
      <div>
            <Button type={'primary'} text={this.props.label} onClick={this.addingComponent} />
            <EmptyModal show={this.state.adding} onHide={this.addingComponent}>
                {addable_components}
            </EmptyModal>
      </div>
    )
  }
}

export default AddChildComponent;
