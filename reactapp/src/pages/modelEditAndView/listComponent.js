import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class ComponentList extends Component {
    constructor(props) {
        super(props);
        this.state = {'components':[]}

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/component/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var components = []
      for (var index in result) {
        var component = result[index]['component'];
        components.push(component)
      }
      this.setState({'components':components, 'loaded':true})
    }

    render() {
      console.log("Here");

      var components = [];
      for (var index in this.state.components) {
        var component = this.state.components[index];
        components.push(<Card name={component.name} description={component.description} button_type={'primary'} button={'View'} link={'/component/' + component.id + '/'} />)
      }

      var content =
        <div className="container">
          <Header size={2} text={'Components'} />
          <br />
          <Button type={'success'} text={'Add New Component'} href={'/editComponent/'} />
          <br />
          {components}
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default ComponentList;
