
import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class ScheduletimeList extends Component {
    constructor(props) {
        super(props);
        this.state = {'scheduletimes':[]}

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/scheduletime/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var scheduletimes = []
      for (var index in result) {
        var scheduletime = result[index]['scheduletime'];
        scheduletimes.push(scheduletime)
      }
      this.setState({'scheduletimes':scheduletimes, 'loaded':true})
    }

    render() {
      console.log("Here");

      var scheduletimes = [];
      for (var index in this.state.scheduletimes) {
        var scheduletime = this.state.scheduletimes[index];
        scheduletimes.push(<Card name={scheduletime.name} description={scheduletime.description} button_type={'primary'} button={'View'} link={'/scheduletime/' + scheduletime.id + '/'} />)
      }

      var content =
        <div className="container">
          <Header size={2} text={'Scheduletimes'} />
          <br />
          <Button type={'success'} text={'Add New Scheduletime'} href={'/editScheduletime/'} />
          <br />
          {scheduletimes}
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default ScheduletimeList;
