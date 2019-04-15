import React, { Component } from 'react';
import {ajaxWrapper, sort_objects} from 'functions';
import {Wrapper, NumberInput, Button, FormWithChildren, EmptyModal, TextInput, If} from 'library';
import ComponentDict from './componentDict.js';
import AddChildComponent from './addChildComponent.js';
import ComponentInstance from './componentInstance.js';
import DisplayInstance from './displayInstance.js';


class PageBuilder extends Component {

    constructor(props) {
        super(props);
        this.state = {components: [], selectedComponent: -1, loaded: false};

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
        this.addBuildingBlock = this.addBuildingBlock.bind(this);
    }

    addBuildingBlock (building_block, parent_index) {
        console.log("Building Block", building_block, parent_index)
        var components = this.state.components
        var next_key = components.length;
        var new_components = JSON.parse(building_block['components'])
        var parent_key_map = {null: parent_index}
        for (var index in new_components) {
            var new_component = new_components[index]
            parent_key_map[new_component['key']] = next_key;
            new_component['key'] = next_key;
            if (parent_key_map[new_component['parent']]) {
                new_component['parent'] = parent_key_map[new_component['parent']]
            }

            new_component['class'] = ComponentDict[new_component['type']];
            components.push(new_component);
            next_key += 1;
        }
        this.setState({components:components})
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
          delete components[i]['props']['children']
      }
      var data = {'components':JSON.stringify(components), componentProps: JSON.stringify(this.state.componentProps), name: this.state.name, url: this.state.url, pagegroup: this.props.page_group_id}
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
        window.location.href = '/pagebuilder/' + this.props.page_group_id + '/' + result[0]['page']['id'] + '/'
      }
      else {
        ajaxWrapper('GET','/api/modelWebsite/page/' + this.props.page_id + '/', {}, this.load)
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
        if (new TempComponent().config['can_have_children']) {
          props['children'] = sort_objects(this.displayCreator(lookup[component['key']], lookup), ['props','content','props','order'])
        }
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
        var config = new selected_component['class']().config
        var components = config['form_components'];



        var new_components = [<NumberInput label={'order'} name={'order'} />];
        for (var index in components) {
            var component = components[index];
            var value = selected_component['props'][component.props['name']];
            component = React.cloneElement(component, {'default': value, 'parentIndex': this.state.selectedComponent, 'addComponent': this.addComponent});
            new_components.push(component);
        }

        if (config['can_have_children']) {
            new_components.push(<AddChildComponent label="Add Child" name="children" parentIndex={this.state.selectedComponent} addComponent={this.addComponent} default={""} addBuildingBlock={this.addBuildingBlock} />)
        }

        new_components.push(<Button default={''} name='delete' deleteType={true} text={'Delete'} onClick={this.removeComponent} type='danger' />)

        var componentPropsForm = <FormWithChildren key={this.state.selectedComponent} autoSetGlobalState={true} setGlobalState={this.setGlobalState}
            globalStateName={'form'}>
            {new_components}
        </FormWithChildren>

      }


    var componentList = this.componentListCreator(topLevelComponents, component_parent_dict)

      var componentColumn = <div>
        <h1>Component List</h1>
        <AddChildComponent label="Add Component" name="children" parentIndex={null} addComponent={this.addComponent} default={""} addBuildingBlock={this.addBuildingBlock} />
        {componentList}
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
           <FormWithChildren defaults={this.state} autoSetGlobalState={true} setGlobalState={this.setGlobalStateName} globalStateName={'form'}>
                <TextInput name='name' label='Name' placeholder='Page Name' />
                <TextInput name="url" label="URL" placeholder="/" />
           </FormWithChildren>
         </div>
          <div className="row">

            <div className="col-2">
              {componentColumn}
              <Button text={'save'} type={'success'} onClick={this.save} />
              <If logic={[['exists', this.props.page_id]]} >
                <Button text={'delete'} type={'danger'} onClick={this.delete} deleteType={true} />
              </If>
              <If logic={[['0294d7d0-f9cf-457c-83d7-4632682934da',this.props.page_group_id]]}>
                <Button text={'Export'} type={'outline-danger'} onClick={this.export} deleteType={true} />
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
