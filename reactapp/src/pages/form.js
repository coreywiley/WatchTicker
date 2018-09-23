import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from "base/ajax.js";

import {
    Button, Image, Paragraph, Form, Select,
    TextInput, ButtonGroup, TextArea, Checklist
} from 'library';

class FormPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {},
            loaded: true
        };
    }

    componentDidMount() {
        if (this.props.id == 0){
            var url = "/api/home/projectform/?related=elements";
            var data = {
                project: this.props.project
            };

            ajaxWrapper("POST",  url, data, this.loadForm.bind(this));

        } else {
            this.getForm();
        }
    }

    getForm() {
        var url = "/api/home/projectform/" + this.props.id + "/?related=elements,project,project__company";
        ajaxWrapper("GET",  url, {}, this.loadForm.bind(this));
    }

    loadForm(result){
        if (this.props.id != result[0]['projectform']['id']) {
            var id = result[0]['projectform']['id'];
            window.location = '/' + this.props.params[0] + '/' + this.props.project + '/' + this.props.params[2] + '/' + id + '/';
        }

        var form = result[0]['projectform'];

        this.setState({
            form: form
        });
    }

    saveForm(){

    }

    addElement(){
        var url = "/api/home/formelement/";
        var data = {
            form: this.props.id
        };

        ajaxWrapper("POST",  url, data, this.loadElement.bind(this));
    }
    loadElement(result){
        var form = this.state.form;
        form['elements'].push(result[0]['formelement']);

        this.setState({
            form: form
        });
    }
    updateElement(result){
        var form = this.state.form;
        var element = result[0]['formelement'];

        for (var i in form['elements']){
            if (form['elements'][i]['formelement']['id'] == element['id']){
                form['elements'][i]['formelement'] = element;
            }
        }

        this.setState({
            form: form
        });
    }

    render() {

        var elements = [];
        for (var i in this.state.form.elements) {
            var data = this.state.form.elements[i]['formelement'];

            elements.push(
                <FormElement data={data} updateElement={this.updateElement.bind(this)} />
            );
        }

        var content =
        <div className='container'>
            <br/><br/>
            <div style={{textAlign:"center"}}>
                <h1>{this.state.form.id} : {this.state.form.name}</h1>

                {elements}

                <Button type="primary" text="Add New Element" clickHandler={this.addElement.bind(this)} />

                <br/>
            </div>
        </div>;

        return (
            <Wrapper token={this.props.user_id} loaded={this.state.loaded}  content={content} />
        );
    }
}




var ELEMENT_TYPES = {
    0: 'Radio',
    1: 'Checkbox',
    2: 'Text Input',
    3: 'Paragraph Input',
    4: 'Text Only',
    5: 'Image',
};

class FormElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            component: null,
            props: null
        };
    }

    changeType(e){
        var url = "/api/home/formelement/" + this.props.data['id'] + "/";
        var type = e['type'];
        var data = {
            type: type
        };

        ajaxWrapper("POST",  url, data, this.props.updateElement.bind(this));
    }

    render() {
        var Component = null;
        var type = ELEMENT_TYPES[this.props.data['type']];
        var props = {};

        if (type == 'Radio') {
            Component = ButtonGroup;
            props = {
                type: 'secondary',
                name: 'test',
                options: ['One', 'Two', 'Three'],
                value: 'One'
            }

        } else if (type == 'Checkbox'){
            Component = Checklist;
            props = {
                name: 'test',
                dataList: [
                    {
                        a: {id: 0, name: 'test', value: 1, label: 'One'}
                    },
                ],
                objectName: 'a'
            }

        } else if (type == 'Text Input'){
            Component = TextInput;
        } else if (type == 'Paragraph Input'){
            Component = TextArea;
        } else if (type == 'Text Only'){
            Component = Paragraph;
        } else if (type == 'Image'){
            Component = Image;
        }

        var options = [];
        for (var key in ELEMENT_TYPES){
            var type = ELEMENT_TYPES[key];
            options.push({'text': type, 'value': key});
        }
        var select = <Select label="Type" name='type' options={options} setFormState={this.changeType.bind(this)} />;

        var Components = [Component];
        var ComponentProps = [props];
        var defaults = {};

        var content =
        <div className='card'>
            {select}

            <Form components={Components} componentProps={ComponentProps} submitFunc={this.newProjectUser} defaults={defaults} />
        </div>;

        return (
            <div>
                {content}
            </div>
        );
    }
}



export default FormPage;
