
import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker} from 'library';

class EditEvent extends Component {
    constructor(props) {
        super(props);

        this.state = {'host' : '', 'name' : '', 'description' : '', 'schedule_start_time' : '', 'length' : '30', 'holidays' : 'false'};

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount(value) {
        if(this.props.event_id) {
          ajaxWrapper('GET','/api/home/event/' + this.props.event_id + '/', {}, this.objectCallback);
        }
        else {
          this.setState({loaded:true})
        }
    }

    objectCallback(result) {
      var event = result[0]['event'];
      event['loaded'] = true;
      this.setState(event)
    }

    render() {

			var Components = [Select, TextInput, TextArea, DateTimePicker, NumberInput, Select, ];

      event_types = [
        {'text':'Book Me (Allow People To Book Into Your Schedule)', 'value':'Book Me'},
        {'text':'One Time Meeting (Find One Time For A Group)', 'value':'One Time Meeting'},
        {'text':'Daily Recurring Meeting (Find A Repeating Time For A Group)', 'value':'Recurring Meeting'},
        {'text':'Weekly Recurring Meeting (Find A Repeating Time For A Group)', 'value':'Recurring Meeting'},
        {'text':'Monthly Recurring Meeting (Find A Repeating Time For A Group)', 'value':'Recurring Meeting'},
        {'text':'Yearly Recurring Meeting (Find A Repeating Time For A Group)', 'value':'Recurring Meeting'},
      ]

			var host = {'name': 'host', 'label': 'Host', 'placeholder': 'Host', 'value': '', 'optionsUrl': '/api/user/user/', 'optionsUrlMap': {'text':'{user.unicode}','value':'{user.id}'}};
      var event_type = {'name': 'type', 'label': 'Event Type', 'placeholder': 'Book Me (Allow People To Book Into Your Schedule)', 'value': '', 'options': event_types};
			var name = {'name': 'name', 'label': 'Name', 'placeholder': 'Name', 'value': ''};
			var description = {'name': 'description', 'label': 'Description', 'placeholder': 'Description', 'value': ''};
			var schedule_start_time = {'name': 'schedule_start_time', 'label': 'Schedule_Start_Time', 'placeholder': 'Schedule_Start_Time', 'value': false, 'display_time': true};
			var length = {'name': 'length', 'label': 'Length', 'placeholder': 0, 'value': 0};
			var holidays = {'name': 'holidays', 'label': 'Holidays', 'placeholder': 'Holidays', 'value': false, 'options': [{'value':true,'text':'True'},{'value':false,'text':'False'}]};
			var ComponentProps = [host, name, description, schedule_start_time, length, holidays];

        var defaults = this.state;

        var submitUrl = "/api/home/event/";
        if (this.props.event_id) {
          submitUrl += this.props.event_id + '/';
        }

        var deleteUrl = undefined;
        if (this.props.event_id) {
          deleteUrl = "/api/home/event/" + this.props.event_id + "/delete/";
        }


        var title = <Header text={'Create New Event'} size={2} />
        if (this.props.event_id) {
          title = <Header text={'Edit Event: ' + this.state.name} size={2} />
        }


        var content = <div className="container">
                {title}
                <Form components={Components} redirectUrl={"/event/{id}/"} componentProps={ComponentProps} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} />
                <br />
        </div>;

        return (
          <div>
            <Wrapper loaded={this.state.loaded} content={content} />
          </div>
             );
    }
}
export default EditEvent;
