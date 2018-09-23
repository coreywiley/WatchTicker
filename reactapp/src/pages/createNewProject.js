import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, TextArea} from 'library';

class CreateNewProject extends Component {
    constructor(props) {
        super(props);
        this.newProjectCreated = this.newProjectCreated.bind(this);
    }

    newProjectCreated(project) {
      ajaxWrapper('POST','/api/home/projectuser/', {'project':project['id'], 'user':this.props.user_id, 'type':'Account Manager'}, this.redirect)
    }

    redirect(result) {
      window.location.href = '/inviteCollaborators/' + result[0]['projectuser']['project'] + '/';
    }

    render() {
        var Components = [TextInput,TextArea];
        var title = {'value':'','name':'first_name','label':'First Name:','placeholder': 'First Name'}
        var description = {'value':'','name':'last_name','label':'Last Name:','placeholder': 'Last Name'}

        var ComponentProps = [title, description];
        var defaults = {'title':'','description':'', };

        var submitUrl = "/api/home/project/";

        var content = <div className="container">
                <h2>Create Your Project</h2>
                <Form components={Components} redirect={this.newProjectCreated} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />
        </div>;


        return (
            <Wrapper loaded={true} content={content} />
             );
    }
}
export default CreateNewProject;
