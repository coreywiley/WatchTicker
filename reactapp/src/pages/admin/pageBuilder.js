import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import {Wrapper} from 'library';
import {
    Form, FormWithChildren, ListWithChildren, Div, If, Break, NumberInput,
    BooleanInput, TextInput, Select, TextArea, FileInput, Button, Header,
    Paragraph, CSSInput, Container, EmptyModal, PasswordInput, ChildComponent
} from 'library';

import APIQuery from './apiQuery.js';
import Alarm from 'projectLibrary/alarm.js';
import PomodoroCard from 'projectLibrary/pomodoroCard.js';


let ComponentDict = [
    Paragraph,
    Header,
    Container,
    Div,
    Break,
    Button,
    FormWithChildren,
    TextInput,
    PasswordInput,
    ListWithChildren,
    If,
    PomodoroCard,
    Alarm,
];

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
        <Button onClick={this.setComponent} text={this.props.name.name} type={type}/>
      </div>
    )
  }
}

class AddChildComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {adding: false}

    this.addComponent = this.addComponent.bind(this);
    this.addingComponent = this.addingComponent.bind(this);
  }

  addingComponent() {
    this.setState({adding: !this.state.adding})
  }

  addComponent(componentName) {
      this.props.addComponent(componentName, this.props.parentIndex)
  }

  render() {
    var addable_components = [];
    for (var index in ComponentDict) {
        var component = ComponentDict[index];
        addable_components.push(<AddComponent name={component} addComponent={this.addComponent} />)
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
        this.state = {components: [], selectedComponent: -1, loaded: true, adding:false};

        this.addingComponent = this.addingComponent.bind(this);
        this.addComponent = this.addComponent.bind(this);
        this.setComponent = this.setComponent.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);
        this.save = this.save.bind(this);
        this.reload = this.reload.bind(this);
        this.load = this.load.bind(this);
        this.componentListCreator = this.componentListCreator.bind(this);
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
      console.log("Set Global State", state)
      var components = this.state.components;
      components[this.state.selectedComponent]['props'] = state;

      this.setState({components:components})
    }

    addingComponent() {
      this.setState({'adding':!this.state.adding})
    }

    addComponent(reference, parent = null) {
      var components = this.state.components;
      var component = {type: reference, props: {}, parent:parent, order: components.length}
      components.push(component)
      this.setState({components: components})
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

    componentListCreator(top_level, lookup) {
      var componentList = [];
      for (var index in top_level) {
        var component = top_level[index]
        componentList.push(<ComponentInstance name={component['type']} index={component['key']}
          setComponent={this.setComponent} selectedComponent={this.state.selectedComponent} />)
        if (lookup[component['key']].length > 0) {
          componentList.push(<div style={{marginLeft:'15px'}}>
            {this.componentListCreator(lookup[component['key']], lookup)}
        </div>)
        }
      }
      return componentList
    }

    displayCreator(top_level, lookup) {
      var display = [];
      for (var index in top_level) {
        var component = top_level[index]
        var TempComponent = component['type'];
        var props = {...component['props']};
        if (props['children']) {
          props['children'] = this.displayCreator(lookup[component['key']], lookup)
        }
        if (this.state.selectedComponent == component['key']) {
          display.push(<DisplayInstance content={<TempComponent {...props} setGlobalState={this.setGlobalState} />} index={index} setComponent={this.setComponent} style={{'border':'2px solid #0f0'}} />)
        }
        else {
          display.push(<DisplayInstance content={<TempComponent {...props} setGlobalState={this.setGlobalState} />} index={index} setComponent={this.setComponent} />)
        }
      }
      return display
    }




    render() {

      var topLevelComponents = []
      var component_parent_dict = {}
      for (var index in this.state.components) {
        var component = this.state.components[index];
        component['key'] = index
        component_parent_dict[parseInt(index)] = []
        if (!component['parent']) {
          topLevelComponents.push(component)
        }
        else {
          component_parent_dict[parseInt(component['parent'])].push(component)
        }
      }

      console.log("Components", this.state.components)
      console.log("Top Level Components", topLevelComponents)
      console.log("component_parent_dict", component_parent_dict)

      var display = this.displayCreator(topLevelComponents, component_parent_dict);

      var componentPropsForm = null;

      if (this.state.selectedComponent > -1) {
        var selected_component = this.state.components[this.state.selectedComponent]
        var components = selected_component['type'].config['form_components'];

        for (var index in components) {
            var component = components[index];
            component = <ChildComponent component={component} newProps={{'parentIndex': this.state.selectedComponent, 'addComponent': this.addComponent}} />;
        }

        var componentPropsForm = <FormWithChildren autoSetGlobalState={true} setGlobalState={this.setGlobalState}
            globalStateName={'form'}>
            {components}
        </FormWithChildren>
      }


      var componentList = this.componentListCreator(topLevelComponents, component_parent_dict)

      var addable_components = [];
      for (var index in ComponentDict) {
          var component = ComponentDict[index];
        addable_components.push(<AddComponent name={component} addComponent={this.addComponent} />)
      }

      var componentColumn = <div>
        <h1>Component List</h1>
        <Button text={'Add Component'} type={'success'} onClick={this.addingComponent} />
        {componentList}
        <EmptyModal show={this.state.adding} onHide={this.addingComponent}>
          {addable_components}
        </EmptyModal>
      </div>;

        var content =
        <div>
        <a href='/pageList/'>Page List</a>
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
