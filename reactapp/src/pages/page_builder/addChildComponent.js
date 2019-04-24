import React, {Component} from 'react';
import {ajaxWrapper} from 'functions';
import {Button, EmptyModal, PageBreak, Header} from 'library';
import ComponentDict from './componentDict.js';

class AddBuildingBlock extends Component {
    constructor(props) {
        super(props);

        this.setBlock = this.setBlock.bind(this);
    }

    setBlock() {
        this.props.addBuildingBlock(this.props.building_block)
    }

    render() {
        return (
            <div>
                <Button onClick={this.setBlock} text={this.props.building_block.name} type={'outline-primary'}/>
            </div>
        )
    }
}

class AddComponent extends Component {
  constructor(props) {
    super(props);
    this.setComponent = this.setComponent.bind(this);
  }

  setComponent() {
    this.props.addComponent(this.props.name)
  }

  render() {
    var type = 'outline-primary';

    return (
      <div>
      <Button onClick={this.setComponent} text={this.props.name.name} type={type}/>
      </div>
    )
  }
}


class AddChildComponent extends Component {
      constructor(props) {
        super(props);
        this.state = {adding: false, building_blocks:[]}

        this.addComponent = this.addComponent.bind(this);
        this.addingComponent = this.addingComponent.bind(this);
        this.building_block_callback = this.building_block_callback.bind(this);
        this.addBuildingBlock = this.addBuildingBlock.bind(this);
      }

      componentDidMount() {
          ajaxWrapper('GET', '/api/modelWebsite/page/?pagegroup=9ed43f0e-5f4e-4aa3-8303-55a4d32d3f38', {}, this.building_block_callback)
      }

      building_block_callback(result) {
          var building_blocks = []
          for (var index in result) {
              building_blocks.push(result[index]['page'])
          }
          this.setState({building_blocks: building_blocks})
      }

      addingComponent() {
        this.setState({adding: !this.state.adding})
      }

    addComponent(componentName) {
        this.props.addComponent(componentName, this.props.parentIndex)
    }

   addBuildingBlock(building_block) {
       this.props.addBuildingBlock(building_block, this.props.parentIndex)
   }

  render() {
    var addable_components = [];
    for (var key in ComponentDict) {
        var component = ComponentDict[key];
        addable_components.push(<AddComponent name={component} addComponent={this.addComponent} />);
    }

    addable_components.push(<PageBreak />)
    addable_components.push(<Header size={3} text='Building Blocks' />)

    for (var index in this.state.building_blocks) {
        var building_block = this.state.building_blocks[index];
        addable_components.push(<AddBuildingBlock building_block={building_block} addBuildingBlock={this.addBuildingBlock} />)
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
