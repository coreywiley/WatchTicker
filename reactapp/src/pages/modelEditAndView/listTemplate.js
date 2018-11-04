
import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class *CapitalObject*List extends Component {
    constructor(props) {
        super(props);
        this.state = {'*Object*s':[]}

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/*App*/*Object*/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var *Object*s = []
      for (var index in result) {
        var *Object* = result[index]['*Object*'];
        *Object*s.push(*Object*)
      }
      this.setState({'*Object*s':*Object*s, 'loaded':true})
    }

    render() {
      console.log("Here");

      var *Object*s = [];
      for (var index in this.state.*Object*s) {
        var *Object* = this.state.*Object*s[index];
        *Object*s.push(<Card name={*Object*.name} description={*Object*.description} button_type={'primary'} button={'View'} link={'/*Object*/' + *Object*.id + '/'} />)
      }

      var content =
        <div className="container">
          <Header size={2} text={'*CapitalObject*s'} />
          <br />
          <Button type={'success'} text={'Add New *CapitalObject*'} href={'/edit*CapitalObject*/'} />
          <br />
          {*Object*s}
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default *CapitalObject*List;
