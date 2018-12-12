import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, Alert, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker, Card, Button} from 'library';

class EditQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {'title' : '', 'body' : '', 'notification_sent': false, loaded:false, notifications:[], 'user':this.props.user.id};

        this.objectCallback = this.objectCallback.bind(this);
        this.sent = this.sent.bind(this);
    }

    componentDidMount(value) {
      ajaxWrapper('GET','/api/home/notifications/',{},this.objectCallback)
    }

    objectCallback(result) {
      var notifications = [];

      for (var index in result) {
          var notification = result[index]['notifications'];
          notifications.push(notification)
      }

      this.setState({notifications:notifications, loaded: true})
    }

    sent(result) {
      this.setState({'notification_sent':true})
    }

    render() {
      console.log("Rendering Notifications")
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

      var notifications = [];
      for (var index in this.state.notifications) {
        var notification_data = this.state.notifications[index];
        notifications.push(<Card name={notification_data.name} link={'/notification/' + notification_data.id + '/'} button_type={'primary'} button={'Edit'} />)
      }

        var submitUrl = "/sendNotification/";

        var content = <div className="container">
                <Header size={2} text={'Send Notification'} />
                <Form components={Components} redirect={this.sent} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />
                {alert}
                <br />
                <Header size={2} text={'Scheduled Notifications'} />
                <Button type={'success'} text={'Schedule Notification'} href={'/notification/'} />
                {notifications}
        </div>;

        return (
          <div>
            <Wrapper loaded={this.state.loaded} content={content} />
          </div>
             );
    }
}
export default EditQuestion;
