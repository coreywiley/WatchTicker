import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, Alert, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker} from 'library';

class EditQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {'title' : '', 'body' : '', 'notification_sent': false, 'user':this.props.user.id};

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount(value) {

    }

    objectCallback(result) {
      var question = result[0]['question'];
      question['loaded'] = true;
      question['question'] = question['id']
      this.setState(question)
    }

    sent(result) {
      this.setState({'notification_sent':true})
    }

    render() {

      var defaults = this.state;

      var Components = [TextInput, TextArea];
      var ComponentProps = [
        {'name':'title', 'label':'Notification Title', 'placeholder':'Title'},
        {'name':'body', 'label':'Notification Message', 'placeholder':'Message'},
      ];
      var alert = null;
      if (this.state.notification_sent) {
        var alert = <Alert text={'Notification Sent'} type={'success'} />
      }

        var submitUrl = "/sendNotification/";

        var content = <div className="container">
                <Form components={Components} redirect={this.sent} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />
                {alert}
                <br />
        </div>;

        return (
          <div>
            <Wrapper loaded={this.state.loaded} content={content} />
          </div>
             );
    }
}
export default EditQuestion;
