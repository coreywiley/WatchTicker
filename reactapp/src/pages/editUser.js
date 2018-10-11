import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput} from 'library';

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {'first_name':'','last_name':'', 'email':'', 'password':'','type':'User', 'gender':'Pick One', 'zipcode':'', 'age':'','phone':''};

    this.getUserInfoCallback = this.getUserInfoCallback.bind(this);
  }

    componentDidMount() {
        console.log("User Id", this.props.user_id)
        ajaxWrapper('GET','/api/user/user/' + this.props.user_id + '/', {}, this.getUserInfoCallback)

    }

    getUserInfoCallback(result) {
      var user = result[0]['user']
      this.setState(user)
    }

    render() {
        var Components = [TextInput,TextInput,TextInput, TextInput, NumberInput, Select, TextInput, PasswordInput];
        var first_name_props = {'value':'','name':'first_name','label':'First Name','placeholder': 'First Name', 'required':true}
        var last_name_props = {'value':'','name':'last_name','label':'Last Name','placeholder': 'Last Name'}
        var email_props = {'value':'','name':'email','label':'Email','placeholder': 'somanydeals@patrongate.com', 'required':true}
        var password_props = {'confirm_password':true, 'required':true};
        var phone =  {'value':'','name':'phone','label':'Phone Number','placeholder': '(651) 123-4567'}
        var age =  {'value':'','name':'age','label':'Age','placeholder': 23}
        var gender =  {'value':'','name':'gender','label':'Gender','options':[{'value':'Pick One','text':'Pick One'}, {'value':'Male', 'text':'Male'}, {'value':'Female','text':'Female'},{'value':'Other','text':"I don't identify as either"}]}
        var zipcode =  {'value':'','name':'zipcode','label':'Zip Code','placeholder': '55104'}

        var ComponentProps = [first_name_props, last_name_props, email_props, phone, age, gender, zipcode, password_props];
        var defaults = this.state;

        var submitUrl = "/api/user/user/" + this.props.user_id + '/';

        var content = <div className="container">
                <h2>Edit Your Info</h2>
                <Form components={Components} redirect={'/'} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />
        </div>;


        return (
            <Wrapper loaded={true} content={content} />
             );
    }
}
export default EditUser;
