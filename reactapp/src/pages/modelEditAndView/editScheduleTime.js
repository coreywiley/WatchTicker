
import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker} from 'library';

class EditScheduletime extends Component {
    constructor(props) {
        super(props);

        this.state = {'start_time' : '', 'end_time' : '', 'available' : 'false', 'repeat_monday' : 'false', 'repeat_tuesday' : 'false', 'repeat_wednesday' : 'false', 'repeat_thursday' : 'false', 'repeat_friday' : 'false', 'repeat_saturday' : 'false', 'repeat_sunday' : 'false', 'user' : '', 'event' : ''};

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount(value) {
        if(this.props.scheduletime_id) {
          ajaxWrapper('GET','/api/home/scheduletime/' + this.props.scheduletime_id + '/', {}, this.objectCallback);
        }
        else {
          this.setState({loaded:true})
        }
    }

    objectCallback(result) {
      var scheduletime = result[0]['scheduletime'];
      scheduletime['loaded'] = true;
      this.setState(scheduletime)
    }

    render() {

				var Components = [DateTimePicker, DateTimePicker, Select, Select, Select, Select, Select, Select, Select, Select, Select, Select, ];

			var start_time = {'name': 'start_time', 'label': 'Start_Time', 'placeholder': 'Start_Time', 'value': false, 'display_time': true};
			var end_time = {'name': 'end_time', 'label': 'End_Time', 'placeholder': 'End_Time', 'value': false, 'display_time': true};
			var available = {'name': 'available', 'label': 'Available', 'placeholder': 'Available', 'value': false, 'options': [{'value':true,'text':'True'},{'value':false,'text':'False'}]};
			var repeat_monday = {'name': 'repeat_monday', 'label': 'Repeat_Monday', 'placeholder': 'Repeat_Monday', 'value': false, 'options': [{'value':true,'text':'True'},{'value':false,'text':'False'}]};
			var repeat_tuesday = {'name': 'repeat_tuesday', 'label': 'Repeat_Tuesday', 'placeholder': 'Repeat_Tuesday', 'value': false, 'options': [{'value':true,'text':'True'},{'value':false,'text':'False'}]};
			var repeat_wednesday = {'name': 'repeat_wednesday', 'label': 'Repeat_Wednesday', 'placeholder': 'Repeat_Wednesday', 'value': false, 'options': [{'value':true,'text':'True'},{'value':false,'text':'False'}]};
			var repeat_thursday = {'name': 'repeat_thursday', 'label': 'Repeat_Thursday', 'placeholder': 'Repeat_Thursday', 'value': false, 'options': [{'value':true,'text':'True'},{'value':false,'text':'False'}]};
			var repeat_friday = {'name': 'repeat_friday', 'label': 'Repeat_Friday', 'placeholder': 'Repeat_Friday', 'value': false, 'options': [{'value':true,'text':'True'},{'value':false,'text':'False'}]};
			var repeat_saturday = {'name': 'repeat_saturday', 'label': 'Repeat_Saturday', 'placeholder': 'Repeat_Saturday', 'value': false, 'options': [{'value':true,'text':'True'},{'value':false,'text':'False'}]};
			var repeat_sunday = {'name': 'repeat_sunday', 'label': 'Repeat_Sunday', 'placeholder': 'Repeat_Sunday', 'value': false, 'options': [{'value':true,'text':'True'},{'value':false,'text':'False'}]};
			var user = {'name': 'user', 'label': 'User', 'placeholder': 'User', 'value': '', 'optionsUrl': '/api/user/user/', 'optionsUrlMap': {'text':'{user.unicode}','value':'{user.id}'}};
			var event = {'name': 'event', 'label': 'Event', 'placeholder': 'Event', 'value': '', 'optionsUrl': '/api/home/event/', 'optionsUrlMap': {'text':'{event.unicode}','value':'{event.id}'}};
			var ComponentProps = [start_time, end_time, available, repeat_monday, repeat_tuesday, repeat_wednesday, repeat_thursday, repeat_friday, repeat_saturday, repeat_sunday, user, event];

        var defaults = this.state;

        var submitUrl = "/api/home/scheduletime/";
        if (this.props.scheduletime_id) {
          submitUrl += this.props.scheduletime_id + '/';
        }

        var deleteUrl = undefined;
        if (this.props.scheduletime_id) {
          deleteUrl = "/api/home/scheduletime/" + this.props.scheduletime_id + "/delete/";
        }


        var title = <Header text={'Create New Scheduletime'} size={2} />
        if (this.props.scheduletime_id) {
          title = <Header text={'Edit Scheduletime: ' + this.state.name} size={2} />
        }


        var content = <div className="container">
                {title}
                <Form components={Components} redirectUrl={"/scheduletime/{id}/"} objectName={'scheduletime'} componentProps={ComponentProps} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} />
                <br />
        </div>;

        return (
          <div>
            <Wrapper loaded={this.state.loaded} content={content} />
          </div>
             );
    }
}
export default EditScheduletime;
