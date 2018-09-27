import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, Button, Card} from 'library';

class Projects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects:[],
            templateForm: null,
            loaded:true,
            newForm: null,
            elementCount: 0
        }

        this.projectCallback = this.projectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/projectform/?project=' + this.props.project_id, {}, this.projectCallback)
      ajaxWrapper('GET','/api/home/projectform/?id=25&related=elements', {}, this.loadTemplateForm.bind(this));
    }

    loadTemplateForm(result){
        this.setState({
            templateForm: result[0]['projectform']
        });
    }

    projectCallback(result) {
      var projects = [];
      for (var index in result) {
        projects.push(result[index]['projectform'])
      }
      this.setState({projects:projects, loaded:true})
    }

    loadFromTemplate(e){
        var url = "/api/home/projectform/?related=elements";
        var data = {
            project: this.props.project_id
        };
        ajaxWrapper("POST",  url, data, this.getFormSetElements.bind(this));
    }
    getFormSetElements(result){
        var form = result[0]['projectform'];

        this.setState({
            newForm: form,
            loaded: false
        });
        for (var i in this.state.templateForm['elements']){
            var element = this.state.templateForm['elements'][i]['formelement'];
            var url = "/api/home/formelement/";
            var data = {
                form: form['id'],
                type: element['type'],
                order: element['order'],
                pretext: element['pretext'],
                data: JSON.stringify(element['data']),
            };

            ajaxWrapper("POST",  url, data, this.loadElement.bind(this));
        }
    }
    loadElement(result){
        if (this.state.elementCount + 1 == this.state.templateForm['elements'].length){
            var id = this.state.newForm['id'];
            window.location = '/project/' + this.props.project_id + '/formbuilder/' + id + '/';

        } else {
            this.setState({
                elementCount: this.state.elementCount + 1
            });
        }
    }

    render() {
      var projects = [];
      for (var index in this.state.projects) {
        projects.push(<Card deleteUrl={'/api/home/projectform/' + this.state.projects[index]['id'] + '/delete/'} link={'/project/' + this.props.project_id + '/formbuilder/' + this.state.projects[index]['id'] +'/'} button_type={'primary'} button={'Edit'} name={this.state.projects[index]['title']} />)
      }

      var template = null;
      if (this.state.templateForm){
          template = <Button css={{marginLeft: "10px"}} inline={true} type={'info'}
              text={'Create from Location Search Template'} clickHandler={this.loadFromTemplate.bind(this)} />;
      }

        var content = <div className="container">
                <h2>
                    Forms
                    <Button css={{marginLeft: "10px"}} inline={true} type={'success'}
                        text={'Add New Form'} href={'/project/' + this.props.project_id + '/formbuilder/0/'} />

                    {template}
                </h2>
                {projects}
        </div>;


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Projects;
