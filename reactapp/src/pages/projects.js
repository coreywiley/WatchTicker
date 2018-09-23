import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, Button} from 'library';

class Projects extends Component {
    constructor(props) {
        super(props);

        this.state = {'projects':[], 'loaded':true}

        this.projectCallback = this.projectCallback.bind(this);

    }


    componentDidMount() {
      ajaxWrapper('GET','/api/home/project/?projectuser__user=' + this.props.user_id, {}, this.projectCallback)
    }

    projectCallback(result) {
      var projects = [];
      for (var index in result) {
        projects.push(result[index]['project'])
      }
      this.setState({projects:projects, loaded:true})
    }

    render() {
      var projects = [];
      for (var index in this.state.projects) {
        projects.push(<a href={'/project/' + this.state.projects[index]['id']}>{this.state.projects[index]['title']}</a>)
      }

        var content = <div className="container">

                <Button type={'success'} text={'Add New Project'} href={'/createNewProject/'} />
                <h2>Projects</h2>
                {projects}
        </div>;


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Projects;
