import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import {Form, NumberInput, BooleanInput, TextInput, Select, TextArea, FileInput, Button, Header, Paragraph, CSSInput, Container, EmptyModal} from 'library';
import APIQuery from './apiQuery.js';

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
    return (
      <div>
      <Button type={'primary'} text={this.props.label} onClick={this.addingComponent} />
      <EmptyModal show={this.state.adding} onHide={this.addingComponent}>
        <AddComponent name={'Paragraph'} addComponent={this.addComponent} />
        <AddComponent name={'Header'} addComponent={this.addComponent} />
        <AddComponent name={'Container'} addComponent={this.addComponent} />
      </EmptyModal>
      </div>
    )
  }
}




let ComponentDict = {
    'Paragraph': {
        component: Paragraph,
        defaults: {'text':'Default Text', 'style':{}},
        form_components: [NumberInput, TextInput, CSSInput],
        form_props: [{'label':'order', name:'order'}, {'label':'text', name:'text'}, {'label':'css', name:'style'}]
    },
    'Header': {
      component: Header,
      defaults: {'text':'Default Text', 'size':2, style:{}},
      form_components: [NumberInput, TextInput, NumberInput, CSSInput],
      form_props :[{'label':'order', name:'order'}, {'label':'text', name:'text'}, {'label':'size', name:'size'}, {'label':'css', name:'style'}]
    },
    'Container': {
      component: Container,
      defaults: {children:[], style:{}},
      form_components: [NumberInput, CSSInput, AddChildComponent],
      form_props: [{'label':'order', name:'order'}, {'label':'css', name:'style'}, {'label':'Add Child Component', name:'children'}]
    }
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

    addComponent(componentName, parent = null) {
      var components = this.state.components;
      var component = {type: componentName, props: ComponentDict[componentName]['defaults'], parent:parent, order: components.length}
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
        var TempComponent = ComponentDict[component['type']]['component'];
        var props = {...component['props']}
        if (props['children']) {
          props['children'] = this.displayCreator(lookup[component['key']], lookup)
        }
        if (this.state.selectedComponent == component['key']) {
          display.push(<DisplayInstance content={<TempComponent {...props} />} index={index} setComponent={this.setComponent} style={{'border':'2px solid #0f0'}} />)
        }
        else {
          display.push(<DisplayInstance content={<TempComponent {...props} />} index={index} setComponent={this.setComponent} />)
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
        var components = ComponentDict[selected_component['type']]['form_components']
        var componentProps = ComponentDict[selected_component['type']]['form_props']
        var defaults = selected_component['props']

        for (var index in componentProps) {
          componentProps[index]['parentIndex'] = this.state.selectedComponent;
          componentProps[index]['addComponent'] = this.addComponent
        }

        var componentPropsForm = <Form components={components} autoSetGlobalState={true} setGlobalState={this.setGlobalState}
        globalStateName={'form'} componentProps={componentProps} defaults={defaults} />
      }


      var componentList = this.componentListCreator(topLevelComponents, component_parent_dict)

      var componentColumn = <div>
        <h1>Component List</h1>
        <Button text={'Add Component'} type={'success'} onClick={this.addingComponent} />
        {componentList}
        <EmptyModal show={this.state.adding} onHide={this.addingComponent}>
          <AddComponent name={'Paragraph'} addComponent={this.addComponent} />
          <AddComponent name={'Header'} addComponent={this.addComponent} />
          <AddComponent name={'Container'} addComponent={this.addComponent} />
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
