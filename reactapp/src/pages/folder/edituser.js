import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, Header, FormWithChildren, TextInput, Select, Instance} from 'library';

class EditUser extends Component {

    render() {

        return (<div className="container">		
            <Header size={3} style={{}} required={""} text={"Edit User"} />
		<Instance dataUrl={resolveVariables({"text":"/api/user/User/{params.1}/"}, window.cmState.getGlobalState(this))["text"]} objectName={"User"} style={{}} required={""} >
			<FormWithChildren submitUrl={"/api/user/User/{props.id}/"} redirectUrl={"/users/"} deleteUrl={"/api/user/User/{props.id}/"} deleteRedirectUrl={"/users/"} defaults={{'email': '{props.email}', 'is_staff': '{props.is_staff}'}} objectName={"User"} style={{}} required={""} parent={"4"} >
				<TextInput name={"email"} style={{}} required={""} label={"Email"} parent={"1"} />
				<Select name={"is_staff"} style={{}} required={""} label={"Is Admin?"} parent={"1"} options={[{'text': 'Yes', 'value': true}, {'text': 'No', 'value': false}]} />
            </FormWithChildren>
        </Instance>
    </div>);
    }
}
export default EditUser;
