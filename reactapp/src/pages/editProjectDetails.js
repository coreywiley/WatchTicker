import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, TextArea} from 'library';

class EditProjectDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {'title':'', 'description':''}
        this.projectCallback = this.projectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/project/' + this.props.project_id + '/')
    }

    projectCallback(result) {
      this.setState(result[0]['project'])
    }


    render() {
        var Components = [TextInput,TextArea];
        var title = {'value':this.state.title,'name':'title','label':'Title:','placeholder': 'Title'}
        var description = {'value':this.state.description,'name':'description','label':'Description:','placeholder': 'Description'}

        var ComponentProps = [title, description];
        var defaults = {'title':this.state.title,'description':this.state.description};

        var submitUrl = "/api/home/project/" + this.props.project_id;

        var content = <div className="container">
                <h2>Edit Your Project</h2>
                <Form components={Components} redirect={'/projectDashboard/' + this.props.project_id + '/'} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />
        </div>;

        return (
            <Wrapper loaded={true} content={content} />
             );
    }
}
export default EditProjectDetails;
