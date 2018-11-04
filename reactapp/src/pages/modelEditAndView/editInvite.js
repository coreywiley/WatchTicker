
import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker} from 'library';

class EditInvite extends Component {
    constructor(props) {
        super(props);

        this.state = {'event' : '', 'user' : '', 'going' : 'false', 'want_to_go' : 'false', 'read' : 'false', 'required' : 'false', 'last_interaction' : '10/31/2018'};

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount(value) {
        if(this.props.invite_id) {
          ajaxWrapper('GET','/api/home/invite/' + this.props.invite_id + '/', {}, this.objectCallback);
        }
        else {
          this.setState({loaded:true})
        }
    }

    objectCallback(result) {
      var invite = result[0]['invite'];
      invite['loaded'] = true;
      this.setState(invite)
    }

    render() {

				var Components = [Select, Select, Select, Select, Select, Select, DateTimePicker, ];

			var event = {'name': 'event', 'label': 'Event', 'placeholder': 'Event', 'value': '', 'optionsUrl': '/api/home/event/', 'optionsUrlMap': {'text':'{event.unicode}','value':'{event.id}'}};
			var user = {'name': 'user', 'label': 'User', 'placeholder': 'User', 'value': '', 'optionsUrl': '/api/user/user/', 'optionsUrlMap': {'text':'{user.unicode}','value':'{user.id}'}};
			var going = {'name': 'going', 'label': 'Going', 'placeholder': 'Going', 'value': false, 'options': [{'value':true,'text':'True'},{'value':false,'text':'False'}]};
			var want_to_go = {'name': 'want_to_go', 'label': 'Want_To_Go', 'placeholder': 'Want_To_Go', 'value': false, 'options': [{'value':true,'text':'True'},{'value':false,'text':'False'}]};
			var read = {'name': 'read', 'label': 'Read', 'placeholder': 'Read', 'value': false, 'options': [{'value':true,'text':'True'},{'value':false,'text':'False'}]};
			var required = {'name': 'required', 'label': 'Required', 'placeholder': 'Required', 'value': false, 'options': [{'value':true,'text':'True'},{'value':false,'text':'False'}]};
			var last_interaction = {'name': 'last_interaction', 'label': 'Last_Interaction', 'placeholder': 'Last_Interaction', 'value': false, 'display_time': true};
			var ComponentProps = [event, user, going, want_to_go, read, required, last_interaction];

        var defaults = this.state;

        var submitUrl = "/api/home/invite/";
        if (this.props.invite_id) {
          submitUrl += this.props.invite_id + '/';
        }

        var deleteUrl = undefined;
        if (this.props.invite_id) {
          deleteUrl = "/api/home/invite/" + this.props.invite_id + "/delete/";
        }


        var title = <Header text={'Create New Invite'} size={2} />
        if (this.props.invite_id) {
          title = <Header text={'Edit Invite: ' + this.state.name} size={2} />
        }


        var content = <div className="container">
                {title}
                <Form components={Components} redirectUrl={"/invite/{id}/"} objectName={'invite'} componentProps={ComponentProps} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} />
                <br />
        </div>;

        return (
          <div>
            <Wrapper loaded={this.state.loaded} content={content} />
          </div>
             );
    }
}
export default EditInvite;
