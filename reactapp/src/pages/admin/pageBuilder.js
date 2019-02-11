import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import {Form, NumberInput, BooleanInput, TextInput, Select, TextArea, FileInput, Button, Header, Paragraph, CSSInput} from 'library';
import APIQuery from './apiQuery.js';

let ComponentDict = {
    'Paragraph': [Paragraph, {'text':'Default Text', 'style':{}}, [NumberInput, TextInput, CSSInput], [{'label':'order', name:'order'}, {'label':'text', name:'text'}, {'label':'css', name:'style'}]],
    'Header':[Header, {'text':'Default Text', 'size':2, style:{}}, [NumberInput, TextInput, NumberInput, CSSInput], [{'label':'order', name:'order'}, {'label':'text', name:'text'}, {'label':'size', name:'size'}, {'label':'css', name:'style'}]]
};


function sorter(a,b) {
  if (a[1].order > b[1].order) {
    return 1
  }
  else {
    return -1
  }
}

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
      <div onClick={this.setComponent} style={this.props.style}>{this.props.content}</div>
    )
  }
}

class PageBuilder extends Component {

    constructor(props) {
        super(props);
        this.state = {components: [], componentProps:[], selectedComponent: -1, loaded: true, adding:false};

        this.addComponent = this.addComponent.bind(this);
        this.setComponent = this.setComponent.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);
        this.save = this.save.bind(this);
        this.reload = this.reload.bind(this);
        this.load = this.load.bind(this);
    }

    componentDidMount() {
      if (this.props.page_id) {
        ajaxWrapper('GET','/api/modelWebsite/page/' + this.props.page_id + '/', {}, this.load)
      }
    }

    load(result) {
      var page = result[0]['page'];
      var components = JSON.parse(page['components'])
      var componentProps = JSON.parse(page['componentProps'])
      this.setState({components: components, componentProps:componentProps})
    }

    setGlobalState(name, state) {
      var components = this.state.components;
      var componentProps = this.state.componentProps;
      componentProps[this.state.selectedComponent] = state;


      var combined = []
      for (var index in components) {
        combined.push([components[index], componentProps[index]])
      }

      combined.sort(sorter)

      var newComponents = []
      var newComponentProps = []

      for (var index in combined) {
        newComponents.push(combined[index][0])
        newComponentProps.push(combined[index][1])
      }

      this.setState({componentProps:newComponentProps, components:newComponents})
    }

    addComponent(componentName) {
      var components = this.state.components;
      var componentProps = this.state.componentProps;

      components.push(componentName)
      componentProps.push(ComponentDict[componentName][1])

      this.setState({components: components, componentProps:componentProps})
    }

    setComponent(index) {
      this.setState({selectedComponent: index})
    }

    save() {
      var submitUrl = '/api/modelWebsite/page/'
      if (this.props.page_id) {
        submitUrl += this.props.page_id + '/'
      }
      var data = {'components':JSON.stringify(this.state.components), componentProps: JSON.stringify(this.state.componentProps)}
      console.log("Data", data)
      ajaxWrapper('POST',submitUrl, data, this.reload)

    }

    reload(result) {
      console.log("Result", result)
      //window.location.href = '/pagebuilder/' + result[0]['page']['id'] + '/'
    }


    render() {

      var display = [];
      for (var index in this.state.components) {
        var TempComponent = ComponentDict[this.state.components[index]][0];
        if (this.state.selectedComponent == index) {
          display.push(<DisplayInstance content={<TempComponent {...this.state.componentProps[index]} />} index={index} setComponent={this.setComponent} style={{'border':'2px solid #0f0'}}/>)
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
        var selected_component_name = this.state.components[this.state.selectedComponent]

        var componentPropsForm = <Form components={ComponentDict[selected_component_name][2]} autoSetGlobalState={true} setGlobalState={this.setGlobalState}
        globalStateName={'form'} componentProps={ComponentDict[selected_component_name][3]}
        defaults={this.state.componentProps[this.state.selectedComponent]} />
      }

      var componentColumn = <div>
        <h1>Component List</h1>
        <Button text={'Add Component'} type={'success'} onClick={() => this.setState({'adding':true})} />
        {componentList}
      </div>
      if (this.state.adding) {
        var addableComponents = [
          <AddComponent name={'Paragraph'} addComponent={this.addComponent} />,
          <AddComponent name={'Header'} addComponent={this.addComponent} />,
      ]

        var componentColumn = <div>
          <h1>Add A Component</h1>
          <Button text={'Go Back'} type={'success'} onClick={() => this.setState({'adding':false})} />
          {addableComponents}
        </div>
      }

        var content =
        <div>

          <div className="row">
            <div className="col-2">
              {componentColumn}
              <Button text={'save'} type={'success'} onClick={this.save} />
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
