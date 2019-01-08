import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Paragraph, Button, Form, TextInput} from 'library';

var componentDict = {
  'Paragraph': Paragraph,
  'Button': Button
}

class Display extends Component {
  constructor(props) {
    super(props);

    this.state = {'title':'Testing', 'description':'Describing stuff is so much fun!', 'button':'See More', 'selectedComponent': 'HeaderSection'}
    this.setGlobalState = this.setGlobalState.bind(this);

  }


  setGlobalState(name,state) {
    this.setState(state)
  }

  render() {

    //header json example
    var header_json = {'component':'HeaderSection', 'props':{}, 'children':[{'component':'Paragraph', 'props':{'text':this.state.title}},
    {'component':'Paragraph', 'props':{'text':this.state.description}, 'children':[]},
    {'component':'Button', 'props':{'type':'btn-outline-secondary', 'text':this.state.button}, 'children':[]}]}

    var children = [];


    for (var index in header_json['children']) {
      var child_json = header_json['children'][index];
      var Component = componentDict[child_json['component']]
      children.push(<Component {...child_json['props']} />)

    }

    if (this.state.selectedComponent == 'HeaderSection') {
      var Components = [];
      var ComponentProps = []
    }
    else {
      console.log("Here")
      var Components = [TextInput]
      var ComponentProps = [{'name':this.state.selectedComponent, 'label':this.state.selectedComponent}]
    }

    var state_form = <Form components={Components} componentProps={ComponentProps} autoSetGlobalState={true} setGlobalState={this.setGlobalState} globalStateName={'form'} defaults={this.state} />

    return (
      <div>
        <div style={{'width':'250px', position:'absolute', top:'60px', left:'0px', backgroundColor:'white', color:'black'}}>
          <h3>Sections</h3>
          <p>HeaderSection</p>
          <div style={{'marginLeft':'20px'}}>
            <p onClick={() => this.setState({'selectedComponent':'title'})}>Paragraph</p>
            <p onClick={() => this.setState({'selectedComponent':'description'})}>Paragraph</p>
            <p onClick={() => this.setState({'selectedComponent':'button'})}>Button</p>
          </div>

          <h3>Props</h3>
          <p>{this.state.selectedComponent}</p>
          {state_form}
        </div>

      <HeaderSection {...header_json['props']}>
        {children}
      </HeaderSection>
      </div>
    )
  }
}


class HeaderSection extends Component {
  constructor(props) {
    super(props);
      this.state = { width: 0, height: 0 };
      this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {

      return (
        <section style={{height: this.state.height}} className="header">
          <div class="container">
            <div class="description ">
              <h1>
                {this.props.children}
              </h1>
            </div>
          </div>
        </section>
      );
    }
}

export default Display;
