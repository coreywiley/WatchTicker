
import React, { Component } from 'react';

import {Wrapper} from 'library';
import {ajaxWrapper} from 'functions';
import {Container, Button, Image, TextInput, Navbar, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class *CapitalObject* extends Component {
    constructor(props) {
        super(props);
        this.state = *Defaults*

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/*App*/*Object*/' + this.props.*Object*_id + '/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var *Object* = result[0]['*Object*'];
      *Object*['loaded'] = true;
      this.setState(*Object*)
    }

    render() {

*ComponentProps*


      var content =
        <div className="container">
          <Header size={1} text={this.state.name} />
*ComponentList*
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default *CapitalObject*;
