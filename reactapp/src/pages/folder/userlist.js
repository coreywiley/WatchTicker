import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, Header, FormWithChildren, TableWithChildren, TextInput, Select, ListWithChildren, Paragraph, Button, Div} from 'library';

class DeleteUser extends Component {
    constructor(props) {
        super(props);
        this.delete_user = this.delete_user.bind(this);
    }

    delete_user() {
        this.props.delete_user(this.props.id)
    }

    render() {
        return (<Button text={"Delete"} type={"danger"} style={{}} onClick={this.delete_user} />)
    }
}

class UserList extends Component {
    constructor(props) {
        super(props);

        this.form_submit = this.form_submit.bind(this);
        this.delete_user = this.delete_user.bind(this);
        this.delete_user_callback = this.delete_user_callback.bind(this);
    }

    form_submit(result) {
        console.log("Form Submitted", result)
        window.cmState.setGlobalState('formSubmitted', {'formSubmitted':true});
        ajaxWrapper('POST','/api/email/', {'to_email': result[0]['user']['email'], 'from_email':'jeremy.thiesen1@gmail.com', 'subject':'You are invited to Watch Ticker', 'text': "You've been invited to join Watch Ticker. Set up your password <a href='http://watchticker.watchchest.com/passwordReset/" + result[0]['user']['id'] + "/'>here.</a>"}, console.log)
    }

    delete_user(id) {
        ajaxWrapper('POST','/api/user/user/' + id + '/delete/', {}, this.delete_user_callback)
    }

    delete_user_callback(result) {
        window.cmState.setGlobalState('deleted',{'deleted':true})

    }

    render() {

        return (<div className="container">
            <Header text={"User List"} size={3} style={{}} required={""} order={"0"} />

    		<FormWithChildren submitUrl={"/api/user/user/"} objectName={"user"} style={{}} required={""} redirect={this.form_submit} globalStateName={"addUser"} defaults={{is_staff: false}}>
                <Header text={"Add New User"} size={"5"} style={{}} required={""} order={"0"} parent={"1"} />
    			<TextInput name={"email"} label={"Email"} style={{}} required={""} order={"1"} parent={"1"} />
    			<Select name={"is_staff"} defaultoption={"false"} label={"Are they an admin?"} options={[{'text': 'Yes', 'value': true}, {'text': 'No', 'value': false}]} style={{}} required={""} order={"2"} parent={"1"} />
            </FormWithChildren>

            <div style={{'height':'50px'}}></div>
                <TableWithChildren headers={['Email', 'Is Admin', 'Edit', 'Delete']} required={""} order={"3"} >
			        <ListWithChildren dataUrl={"/api/user/User/"} objectName={"User"} table={"true"} style={{}} required={""} parent={"2"} >
        				<Paragraph text={"{props.email}"} style={{}} required={""} parent={"5"} />
        				<Paragraph text={"{props.is_staff}"} style={{}} required={""} parent={"5"} />
        				<Button text={"Edit"} type={"primary"} href={"/editUser/{props.id}/"} style={{}} required={""} parent={"5"} />
                        <DeleteUser id={'{props.id}'} delete_user={this.delete_user}/>
                    </ListWithChildren>
                </TableWithChildren>
		<Div style={{'height': '60px'}} required={""} order={"2"} >
</Div></div>);
    }
}
export default UserList;
