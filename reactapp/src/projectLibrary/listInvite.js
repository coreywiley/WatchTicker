
import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';
import EditInvite from '../pages/modelEditAndView/editInvite.js';

class InviteList extends Component {
    constructor(props) {
        super(props);
        this.state = {'invites':[], 'name':''}

        this.objectCallback = this.objectCallback.bind(this);
        this.getEventInfo = this.getEventInfo.bind(this);
        this.refreshData = this.refreshData.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/event/' + this.props.event_id + '/', {}, this.getEventInfo)
      ajaxWrapper('GET','/api/home/invite/?related=user&event=' + this.props.event_id, {}, this.objectCallback);
    }

    refreshData() {
      ajaxWrapper('GET','/api/home/invite/?event=' + this.props.event_id, {}, this.objectCallback);
    }

    getEventInfo(result) {
      var event = result[0]['event'];
      this.setState(event)
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

      var invites = [];
      for (var index in this.state.invites) {
        var invite = this.state.invites[index];
        invites.push(<EditInvite event={this.props.event_id} user={this.props.user.id} refreshData={this.refreshData} email={invite['user']['email']} requiredInvite={invite['required']} {...invite} loaded={true} />)
      }

      var content =
        <div className="container">
          <Header size={2} text={'Invites for Event: ' + this.state.name} />
          <br />
          <EditInvite refreshData={this.refreshData} event={this.props.event_id} user={this.props.user.id} loaded={true} />
          {invites}
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default InviteList;
