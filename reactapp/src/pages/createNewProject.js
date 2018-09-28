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
      console.log("New Project", project)
      console.log({'project':project[0]['project']['id'], 'user':this.props.user_id, 'type':'Account Manager'});
      ajaxWrapper('POST','/api/home/projectuser/', {'project':project[0]['project']['id'], 'user':this.props.user_id, 'type':'Account Manager'}, this.redirect)
    }

    redirect(result) {
      window.location.href = '/projectForms/' + result[0]['projectuser']['project_id'] + '/';
    }

    render() {
        var Components = [TextInput,TextArea, Select];
        var title = {'value':'','name':'title','label':'Title:','placeholder': 'Title'}
        var description = {'value':'','name':'description','label':'Description:','placeholder': 'Description'}
        var project_type = {'value':'', 'name':'type', 'label':'Project Type', 'options':[{'value':'Market Research', 'text':'Market Research'}]}
        var ComponentProps = [title, description, project_type];
        var defaults = {'title':'','description':''};

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
