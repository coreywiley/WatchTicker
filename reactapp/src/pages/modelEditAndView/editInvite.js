
import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker} from 'library';

class EditInvite extends Component {
    constructor(props) {
        super(props);

        this.state = {...this.props};

        this.formCallback = this.formCallback.bind(this);
        this.submit = this.submit.bind(this);
        this.userCheck = this.userCheck.bind(this);
        this.userCheckCallback = this.userCheckCallback.bind(this);
        this.userCreatedCallback = this.userCreatedCallback.bind(this);
    }


    formCallback(result) {
      this.props.refreshData();
    }


    submit(data) {
      console.log("Submit")
      var email = data['email']
      var required = data['requiredInvite']

      this.setState({email:email, required: required}, this.userCheck)

    }

    userCheck() {
      console.log("User Check", this.state.email)
      ajaxWrapper('GET','/api/user/user/?email=' + this.state.email, {}, this.userCheckCallback)
    }

    userCheckCallback(result) {
      console.log("User Check", result)
      if (result.length > 0) {
        var user = result[0]['user'];
        ajaxWrapper('POST','/api/home/invite/',{event: this.props.event, user: user.id, required:this.state.required}, this.props.refreshData)
      }
      else {
        ajaxWrapper('POST','/api/user/user/',{'email':this.state.email},this.userCreatedCallback)
      }
    }

    userCreatedCallback(result) {
      console.log("User Created Callback", result)
      var user = result[0]['user'];
      ajaxWrapper('POST','/api/home/invite/',{event: this.props.event, user: user.id, required:this.state.required}, this.props.refreshData)
    }

    render() {

			var Components = [TextInput,Select];
      var email = {'name': 'email', 'label': 'Email', 'value': '', 'placeholder':'email@email.com', 'required':true};
			var required = {'name': 'requiredInvite', 'label': 'Does this person need to be here?', 'required':true, 'value': false, 'options': [{'value':true,'text':'True'},{'value':false,'text':'False'}]};
			var ComponentProps = [email, required];

        var defaults = this.state;

        var submitUrl = "/api/home/invite/";
        if (this.props.invite_id) {
          submitUrl += this.props.invite_id + '/';
        }

        var deleteUrl = undefined;
        if (this.props.id) {
          deleteUrl = "/api/home/invite/" + this.props.id + "/delete/";
        }

        var content = <div className="container">
                <Form components={Components} refreshData={this.props.refreshData} objectName={'invite'} componentProps={ComponentProps} deleteUrl={deleteUrl} submit={this.submit} refreshData={this.formCallback} defaults={defaults} />
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
