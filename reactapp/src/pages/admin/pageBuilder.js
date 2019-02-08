import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import {Form, NumberInput, BooleanInput, TextInput, Select, TextArea, FileInput, Button, Header, Paragraph} from 'library';
import APIQuery from './apiQuery.js';

let ComponentDict = {
    'Paragraph': [Paragraph, {'text':'Default Text'}],
};

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

    return (
      <div>
      <Button onClick={this.setComponent} text={this.props.name} type={type}/>
      </div>
    )
  }
}

class DisplayInstance extends Component {
  constructor(props) {
    super(props);
    this.setComponent = this.setComponent.bind(this);
  }

  setComponent() {
    this.props.setComponent(this.props.index)
  }

  render() {

    return (
      <div onClick={this.setComponent}>{this.props.content}</div>
    )
  }
}

class PageBuilder extends Component {

    constructor(props) {
        super(props);
        this.state = {components: [], componentProps:[], selectedComponent: -1, loaded: true};

        this.addComponent = this.addComponent.bind(this);
        this.setComponent = this.setComponent.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);

    }

    setGlobalState(name, state) {
      var componentProps = this.state.componentProps;
      componentProps[this.state.selectedComponent] = state;
      this.setState({componentProps:componentProps})
    }

    addComponent() {
      var components = this.state.components;
      var componentProps = this.state.componentProps;

      components.push("Paragraph")
      componentProps.push(ComponentDict["Paragraph"][1])

      this.setState({components: components, componentProps:componentProps})
    }

    setComponent(index) {
      this.setState({selectedComponent: index})
    }


    render() {

      var display = [];
      for (var index in this.state.components) {
        var TempComponent = ComponentDict[this.state.components[index]][0];
        if (this.state.selectedComponent == index) {
          display.push(<TempComponent {...this.state.componentProps[index]} style={{'border':'2px solid #0f0'}}/>)
        }
        else {
          display.push(<DisplayInstance content={<TempComponent {...this.state.componentProps[index]} />} index={index} setComponent={this.setComponent} />)
        }

      }

      var componentList = [];
      for (var index in this.state.components) {
        componentList.push(<ComponentInstance name={this.state.components[index]} index={index} setComponent={this.setComponent} selectedComponent={this.state.selectedComponent} />)
      }

      var componentPropsForm = null;

      if (this.state.selectedComponent > -1) {
        var componentPropsForm = <Form components={[TextInput]} autoSetGlobalState={true} setGlobalState={this.setGlobalState}
        globalStateName={'form'} componentProps={[{'label':'text', name:'text'}]}
        defaults={this.state.componentProps[this.state.selectedComponent]} />
      }

        var content =
        <div>

          <div className="row">
            <div className="col-2">
              <h1>Component List</h1>
              <p>Selected Component: {this.state.selectedComponent}</p>
              <Button text={'Add Component'} type={'success'} onClick={this.addComponent} />
              {componentList}
            </div>
            <div className="col-8">
              {display}
            </div>
            <div className="col-2">
              <h1>Edit Props</h1>
              {componentPropsForm}
            </div>

          </div>

        </div>;

        return (
            <div className="container-fluid">
                <Wrapper loaded={this.state.loaded} content={content} />
            </div>
             );
    }
}
export default PageBuilder;
