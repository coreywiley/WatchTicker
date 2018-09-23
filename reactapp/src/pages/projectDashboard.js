import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, Button} from 'library';

class Projects extends Component {
    constructor(props) {
        super(props);

        this.state = {'submissions':[], 'project':{}, form_id: 0, 'loaded':false}

        this.submissionsCallback = this.submissionsCallback.bind(this);

    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/formsubmission/?project_id=' + this.props.project_id, {}, this.submissionsCallback)
    }


    submissionsCallback(result) {
      var submissions = [];
      for (var index in result) {
        submissions.push(result[index]['formsubmission'])
      }
      this.setState({submissions:submissions, loaded:true})
    }

    render() {
      var submissions = [];
      var form_id = 0;
      for (var index in this.state.submissions) {
        submissions.push(<p><a href={'/projectDashboard/' + this.state.submissions[index]['id']}>{this.state.submissions[index]['searchTerm']}</a></p>)
      }

        var content = <div className="container">
                <Button type={'success'} text={'Add New Submission'} href={'/project/' + this.props.project_id + '/view/' + this.state.form_id + '/submission/0/'} />
                <h2>Submissions</h2>
                {submissions}
        </div>;


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Projects;
