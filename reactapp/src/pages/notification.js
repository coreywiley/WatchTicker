import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker, Checkbox} from 'library';

class Notification extends Component {
    constructor(props) {
        super(props);

        this.state = {'name' : '', 'title' : '', 'body' : '', 'date' : '', days_after:0, repeat: 0, 'loaded':false};

        this.objectCallback = this.objectCallback.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);
    }

    componentDidMount(value) {
        if(this.props.notification_id) {
          ajaxWrapper('GET','/api/home/notifications/' + this.props.notification_id + '/', {}, this.objectCallback);
        }
        else {
          this.setState({loaded:true})
        }
    }

    setGlobalState(name,state) {

      this.setState(state)
    }

    objectCallback(result) {
      var question = result[0]['notifications'];

      question['loaded'] = true;
      this.setState(question)
    }

    render() {

			var Components = [TextInput, TextInput, TextArea, TextInput, NumberInput, NumberInput];

			var name = {'name': 'name', 'label': 'Notification Name (Internal Purposes Only)', 'placeholder': 'Wish A Happy Birthday', 'value': ''};
			var title = {'name': 'title', 'label': 'Notification Title', 'placeholder': 'Happy Birthday', 'value': ''};
      var body = {'name': 'body', 'label': 'Notification Message', 'placeholder': 'We at Norma wanted to wish you a happy and healthy birthday.', 'value': ''};
      var date = {'name': 'date', 'label': 'Start Date (Use the format 12/31/2018 09:00 AM or the variables {last_login},{birthday},{last_menstrual_period})', 'placeholder': '{birthday}', 'value': ''};
			var days_after = {'name': 'days_after', 'label': 'Send Notification How Many Days After Date', 'placeholder': 0, 'value': ''};
      var repeat = {'name': 'repeat', 'label': 'Repeat Notification How Many Days After First Reminder (This will repeat forever, leave at 0 for no repeat)', 'placeholder': 0, 'value': ''};

      var defaults = this.state;

      var ComponentProps = [name,title,body,date,days_after,repeat]



        var submitUrl = null;
        if (this.state.props != '') {
          var submitUrl = "/api/home/notifications/";
          if (this.props.notification_id) {
            submitUrl += this.props.notification_id + '/';
          }
        }

        var deleteUrl = undefined;
        if (this.props.notification_id) {
          deleteUrl = "/api/home/notifications/" + this.props.notification_id + "/delete/";
        }


        var title = <Header text={'Create New Notification'} size={2} />
        if (this.props.notification_id) {
          title = <Header text={'Edit Notification: ' + this.state.name} size={2} />
        }


        var content = <div className="container">
                {title}
                <Form components={Components} redirectUrl={"/notifications/"} objectName={'notifications'} componentProps={ComponentProps} setGlobalState={this.setGlobalState} autoSetGlobalState={true} globalStateName={'notifications'} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} />
                <br />
        </div>;

        return (
          <div>
            <Wrapper loaded={this.state.loaded} content={content} />
          </div>
             );
    }
}
export default Notification;
