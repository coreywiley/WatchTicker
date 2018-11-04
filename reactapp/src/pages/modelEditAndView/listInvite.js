
import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class InviteList extends Component {
    constructor(props) {
        super(props);
        this.state = {'invites':[]}

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/invite/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var invites = []
      for (var index in result) {
        var invite = result[index]['invite'];
        invites.push(invite)
      }
      this.setState({'invites':invites, 'loaded':true})
    }

    render() {
      console.log("Here");

      var invites = [];
      for (var index in this.state.invites) {
        var invite = this.state.invites[index];
        invites.push(<Card name={invite.name} description={invite.description} button_type={'primary'} button={'View'} link={'/invite/' + invite.id + '/'} />)
      }

      var content =
        <div className="container">
          <Header size={2} text={'Invites'} />
          <br />
          <Button type={'success'} text={'Add New Invite'} href={'/editInvite/'} />
          <br />
          {invites}
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default InviteList;
