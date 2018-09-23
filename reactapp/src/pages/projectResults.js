import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, Button, Card} from 'library';

class Projects extends Component {
    constructor(props) {
        super(props);

        this.state = {'projects':[], 'loaded':true}

        this.projectCallback = this.projectCallback.bind(this);

    }


    componentDidMount() {
      ajaxWrapper('GET','/api/home/projectform/?project=' + this.props.project_id, {}, this.projectCallback)
    }

    projectCallback(result) {
      var projects = [];
      for (var index in result) {
        projects.push(result[index]['projectform'])
      }
      this.setState({projects:projects, loaded:true})
    }

    render() {
      var projects = [];
      for (var index in this.state.projects) {
        projects.push(<Card link={'/project/' + this.props.project_id + '/results/' + this.state.projects[index]['id'] +'/'} button_type={'primary'} button={'View Results'} name={this.state.projects[index]['title']} />)
      }

        var content = <div className="container">
                <h2>Form Results</h2>
                {projects}
        </div>;


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Projects;
