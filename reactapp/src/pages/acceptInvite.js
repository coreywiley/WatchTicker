
import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker} from 'library';

class EditInvite extends Component {
    constructor(props) {
        super(props);

        this.state = {'user':{'first_name':''}, 'loaded':true};

        this.inviteCallback = this.inviteCallback.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);
    }


    componentDidMount() {
      ajaxWrapper('GET','/api/home/invite/' + this.props.invite_id + '/?related=user',{},this.inviteCallback)
    }

    inviteCallback(result) {
      this.setState(result[0]['invite'])
    }

    setGlobalState(name,value) {
      this.setState({'user':value})
    }

    render() {


        var defaults = this.state;

        var submitUrl = "/api/home/invite/";
        if (this.props.invite_id) {
          submitUrl += this.props.invite_id + '/';
        }



        if (this.state.loaded && this.state.user.first_name != '') {
          var Components = [Paragraph, TextInput, TextInput];
          var intro = {'text':'Welcome to Calendar! It looks like this is your first event. Let us know your name so we can tell the organizer.'}
          var first_name = {'name': 'first_name', 'label': 'First Name', 'value': '', 'required':true};
          var last_name = {'name': 'last_name', 'label': 'Last Name', 'value': '', 'required':false};
          var ComponentProps = [intro, first_name, last_name];

          var content = <div className="container">
                  <Form components={Components} objectName={'user'} componentProps={ComponentProps} deleteUrl={deleteUrl} submitUrl={'/api/user/user/' + this.state.user.id + '/'}
                   globalStateName={'user'} setGlobalState={this.setGlobalState} refreshData={this.formCallback} defaults={defaults} />
                  <br />
          </div>;
        }
        else {
          var content = <Availability event_id={this.state.event} user_id={this.state.user.id} invite_id={this.state.id} />;
        }

        return (
          <div>
            <Wrapper loaded={this.state.loaded} content={content} />
          </div>
             );
    }
}
export default EditInvite;
