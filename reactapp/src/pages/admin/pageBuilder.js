import React, { Component } from 'react';
import {ajaxWrapper, sort_objects} from 'functions';
import {Wrapper} from 'library';
import {Form, FormWithChildren, LogInForm, SignUpForm, ListWithChildren, Div, If, Break, NumberInput,
        BooleanInput, TextInput, Select, TextArea, FileInput, Button, Header, Paragraph, CSSInput,
        Container, EmptyModal, PasswordInput, ChildComponent, Json_Input, Function_Input, PasswordResetRequest} from 'library';
import APIQuery from './apiQuery.js';
import Alarm from 'projectLibrary/alarm.js';
import PomodoroCard from 'projectLibrary/pomodoroCard.js';
import Nav from 'projectLibrary/nav.js';


let ComponentList = [
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
    LogInForm,
    SignUpForm,
    Nav,
];

var ComponentDict = {}
for (var i in ComponentList){
    var value = ComponentList[i];
    ComponentDict[value.name] = value;
}

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
    if (!this.props.show) {
      this.props.setComponent(this.props.index)
    }
  }

  render() {
    console.log("Content", this.props.content)
    return (
      <div onClick={this.setComponent} style={this.props.style}>
        <ChildComponent component={this.props.content} newProps={this.props} />
      </div>
    )
  }
}

class PageBuilder extends Component {

    constructor(props) {
        super(props);
        this.state = {components: [], selectedComponent: -1, loaded: false, adding:false};

        this.addingComponent = this.addingComponent.bind(this);
        this.addComponent = this.addComponent.bind(this);
        this.setComponent = this.setComponent.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.reload = this.reload.bind(this);
        this.load = this.load.bind(this);
        this.componentListCreator = this.componentListCreator.bind(this);
        this.setGlobalStateName = this.setGlobalStateName.bind(this);
        this.removeComponent = this.removeComponent.bind(this);
        this.componentsToRemove = this.componentsToRemove.bind(this);
    }

    componentDidMount() {
      if (this.props.page_id) {
        ajaxWrapper('GET','/api/modelWebsite/page/' + this.props.page_id + '/', {}, this.load)
      }
      else if (this.props.show) {
        ajaxWrapper('GET','/api/modelWebsite/page/?url=' + this.props.route, {}, this.load)
      }
      else {
        this.setState({loaded:true});
      }
    }

    load(result) {
      var page = result[0]['page'];
      var components = JSON.parse(page['components']);
      for (var i in components){
          var component = components[i];
          component['class'] = ComponentDict[component['type']];
      }


      var componentProps = JSON.parse(page['componentProps']);
      this.setState({
          components: components,
          componentProps:componentProps,
          name:page.name,
          url: page.url,
          loaded:true
      });
    }

    setGlobalStateName(name,state) {
      this.setState(state);
    }

    setGlobalState(name, state) {
      console.log("Set Global State", state)
      var components = this.state.components;
      if (components[this.state.selectedComponent]) {
        components[this.state.selectedComponent]['props'] = state;
      }

      this.setState({components:components})
    }

    addingComponent() {
      this.setState({'adding':!this.state.adding})
    }

    addComponent(reference, parent = null) {
      var components = this.state.components;
      var component = {type: reference.name, class: reference, props: {}, parent:parent, order: components.length}
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

      var components = this.state.components.slice(0);
      for (var i in components){
          delete components[i]['class'];
      }

      var data = {'components':JSON.stringify(components), componentProps: JSON.stringify(this.state.componentProps), name: this.state.name, url: this.state.url}
      console.log("Data", data)
      ajaxWrapper('POST',submitUrl, data, this.reload)

    }

    delete() {
      if (this.props.page_id) {
        ajaxWrapper('POST','/api/modelWebsite/page/' + this.props.page_id + '/delete/', {}, () => window.location = '/pageList/')
      }
    }

    reload(result) {
      console.log("Result", result)
      if (!this.props.page_id) {
        window.location.href = '/pagebuilder/' + result[0]['page']['id'] + '/'
      }
    }

    componentListCreator(top_level, lookup) {
      var componentList = [];
      for (var index in top_level) {
        var component = top_level[index]
        componentList.push(<ComponentInstance name={component['class']} index={component['key']}
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
      top_level = sort_objects(top_level, ['props','order'])
      console.log("Top Level", top_level)
      for (var index in top_level) {
        var component = top_level[index]
        var TempComponent = component['class'];
        var props = {...component['props']};
        if (props['children']) {
          props['children'] = sort_objects(this.displayCreator(lookup[component['key']], lookup), ['props','content','props','order'])
        }
        console.log("Props", props)
        if (this.state.selectedComponent == component['key']) {
          display.push(<DisplayInstance show={this.props.show} content={<TempComponent {...props} setGlobalState={this.setGlobalState} />} index={index} setComponent={this.setComponent} style={{'border':'2px solid #0f0'}} />)
        }
        else {
          display.push(<DisplayInstance show={this.props.show} content={<TempComponent {...props} setGlobalState={this.setGlobalState} />} index={index} setComponent={this.setComponent} />)
        }
      }
      return display
    }

    componentsToRemove(parent_id) {
      var components = this.state.components;
      var remove_components = [];
      for (var index in components) {
        var component = components[index];
        if (parseInt(component['parent']) == parseInt(parent_id)) {
          remove_components.push(index);
          remove_components.push(...this.componentsToRemove(index))
        }
      }

      return remove_components;
    }

    removeComponent() {
      console.log("Remove Component", this.state.selectedComponent);
      var components = this.state.components;
      var componentProps = this.state.componentProps;
      var componentsToRemove = this.componentsToRemove(this.state.selectedComponent);
      componentsToRemove.push(this.state.selectedComponent);
      console.log("Components To Remove", componentsToRemove)

      var new_components = [];
      var new_component_props = [];
      for (var index in components) {
        if (componentsToRemove.indexOf(index) == -1) {
          new_components.push(components[index]);
          new_component_props.push(componentProps[index]);
        }
      }

      this.setState({components: new_components, componentProps:new_component_props, selectedComponent: -1});
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

      var display = this.displayCreator(topLevelComponents, component_parent_dict);

      var componentPropsForm = null;

      if (this.state.selectedComponent > -1) {
        var selected_component = this.state.components[this.state.selectedComponent]
        var components = new selected_component['class']().config['form_components'];

        var new_components = [];
        for (var index in components) {
            var component = components[index];
            var value = selected_component['props'][component.props['name']];
            component = React.cloneElement(component, {'default': value, 'parentIndex': this.state.selectedComponent, 'addComponent': this.addComponent});
            new_components.push(component);
        }

        var componentPropsForm = <FormWithChildren key={this.state.selectedComponent} autoSetGlobalState={true} setGlobalState={this.setGlobalState}
            globalStateName={'form'}>
            {new_components}
        </FormWithChildren>
      }


      var componentList = this.componentListCreator(topLevelComponents, component_parent_dict)

      var addable_components = [];
      for (var key in ComponentDict) {
          var component = ComponentDict[key];
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

      var nameComponents = [TextInput, TextInput]
      var nameComponentProps = [{'name':'name', label:'name', placeholder:'Page Name'}, {'name':'url', label:'url', 'placeholder':'/'}]

      if (this.props.show) {
        var content = <div>
        {display}
        </div>
      }
      else {
        var content =
        <div>
        <a href='/pageList/'>Page List</a>
        <div className="container">
           <a href='/pageList/'>See All Pages</a>
           <Form components={nameComponents} componentProps={nameComponentProps} defaults={this.state} autoSetGlobalState={true} setGlobalState={this.setGlobalStateName} globalStateName={'form'} />
         </div>
          <div className="row">

            <div className="col-2">
              {componentColumn}
              <Button text={'save'} type={'success'} onClick={this.save} />
              <If logic={[['exists', this.props.page_id]]} >
                <Button text={'delete'} type={'danger'} onClick={this.delete} deleteType={true} />
              </If>
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
      }

        return (
            <div className="container-fluid">
                <Wrapper loaded={this.state.loaded} content={content} />
            </div>
             );
    }
}
export default PageBuilder;
