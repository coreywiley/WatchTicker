import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {
  Form, TextInput, Select, PasswordInput,
  Header, TextArea, NumberInput, DateTimePicker,
  ButtonGroup, Button
} from 'library';


var MODEL_TYPES = [
    {'text':'Binary', 'value':'Binary'},
    {'text':'Boolean', 'value':'Boolean'},
    {'text':'Date', 'value':'Date'},
    {'text':'Time', 'value':'Time'},
    {'text':'Datetime', 'value':'Datetime'},
    {'text':'Elapsed', 'value':'Elapsed'},
    {'text':'Big Number', 'value':'Big Number'},
    {'text':'Decimal', 'value':'Decimal'},
    {'text':'Float', 'value':'Float'},
    {'text':'Integer', 'value':'Integer'},
    {'text':'Char', 'value':'Char'},
    {'text':'Text', 'value':'Text'},
]


class ModelMaker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            configs: [],
            relatedNames: [],
        };

        this.objectCallback = this.objectCallback.bind(this);
        this.addModel = this.addModel.bind(this);
    }

    componentDidMount() {
        ajaxWrapper('GET','/api/modelConfig/', {}, this.objectCallback);
    }

    objectCallback(result) {
        var names = [];
        for (var i=0; i<result.length; i++){
            names.push({'text':result[i]['name'], 'value':result[i]['name']});
        }

        this.setState({
            'configs': result,
            'loaded': true,
            'relatedNames': names,
        });
    }

    addModel(event){
        var configs = this.state.configs;
        configs.push({
            'name':'',
            'data': {
                'fields':[],
                'related':[],
            },
        });

        this.setState({
            configs: configs,
        });
    }

    render() {
        var forms = [];

        var submitUrl = "/api/modelConfig/";
        for (var i=0; i < this.state.configs.length; i++){
            var config = this.state.configs[i];

            var form = <ConfigForm config={config} submitUrl={submitUrl} relatedNames={this.state.relatedNames} />;
            forms.push(form);
        }

        var title = <Header text={'Django Model Configuration'} size={2} />;
        var content =
            <div className="container">
                <div className="row">
                    <div className="col-12"><br/><br/></div>
                    <div className="col-12">
                        {title}
                        <br/>
                        {forms}
                        <br/>
                        <Button type={'success'} text={'Add New Model'} clickHandler={this.addModel} />
                        <br />
                    </div>
                </div>
            </div>;


        return (
            <div>
                <Wrapper loaded={this.state.loaded} content={content} />
            </div>
        );

    }
}


class ConfigForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.addField = this.addField.bind(this);
        this.addRelated = this.addRelated.bind(this);
    }

    componentDidMount(){
        this.setState(this.props.config);
    }

    addField(event){
        var data = this.state.data;
        if (!(data.fields)){
            data.fields = [];
        }
        data.fields.push({});

        this.setState({
            data: data,
        });
    }

    addRelated(event){
        var data = this.state.data;
        if (!(data.related)){
            data.related = [];
        }
        data.related.push({});

        this.setState({
            data: data,
        });
    }

    render() {
        var config = this.state;

        var defaults = {name: config['name']};
        var title = {'text': 'Model Config', 'size': 4};
        var name = {'name': 'name', 'label': 'Name', 'placeholder': 'Name', 'value': ''};

        var Components = [Header, TextInput];
        var ComponentProps = [title, name];

        if (config['id']){
            var id = {'name': 'id', 'layout': 'hidden'};
            Components.push(TextInput);
            ComponentProps.push(id);
            defaults['id'] = config['id'];
        }

        if (config['data']){
            var fields = [];
            if (config['data']['fields']){
                fields = config['data']['fields'];
            }
            for (var j=0; j < fields.length; j++){
                var field = fields[j];
                var fieldStyle = {'marginLeft': '25px'};

                Components.push(Header);
                ComponentProps.push({'text': 'Field Config', 'size': 5, 'layout': 'fieldStyle'});

                defaults["field_name" + "_" + j] = field['name'];
                Components.push(TextInput);
                ComponentProps.push({'name': "field_name" + "_" + j, 'label': 'Name', 'placeholder': 'Name', 'value': '', 'layout': 'fieldStyle'});

                defaults["field_type" + "_" + j] = field['type'];
                Components.push(Select);
                ComponentProps.push({'name': 'field_type' + "_" + j, 'label': 'Type', 'options': MODEL_TYPES, 'layout': 'fieldStyle'});

                defaults["field_default" + "_" + j] = field['default'];
                Components.push(TextInput);
                ComponentProps.push({'name': "field_default" + "_" + j, 'label': 'Default', 'placeholder': 'Default', 'value': '', 'layout': 'fieldStyle'});

                defaults["field_blank" + "_" + j] = field['blank'];
                Components.push(ButtonGroup);
                ComponentProps.push({'name': 'field_blank' + "_" + j, 'label': 'Blank', 'options': ['True', 'False'], 'type': 'secondary', 'layout': 'fieldStyle'});
            }

            var related = [];
            if (config['data']['related']){
                related = config['data']['related'];
            }
            for (var j=0; j < related.length; j++){
                var field = related[j];
                var fieldStyle = {'marginLeft': '25px'};

                Components.push(Header);
                ComponentProps.push({'text': 'Related Config', 'size': 5, 'layout': 'fieldStyle'});

                defaults["related_name" + "_" + j] = field['name'];
                Components.push(TextInput);
                ComponentProps.push({'name': "related_name" + "_" + j, 'label': 'Name', 'placeholder': 'Name', 'value': '', 'layout': 'fieldStyle'});

                defaults["related_model" + "_" + j] = field['model'];
                Components.push(Select);
                ComponentProps.push({'name': 'related_model' + "_" + j, 'label': 'Model', 'options': this.props.relatedNames, 'layout': 'fieldStyle'});

                defaults["related_alias" + "_" + j] = field['alias'];
                Components.push(TextInput);
                ComponentProps.push({'name': "related_alias" + "_" + j, 'label': 'Default', 'placeholder': 'Alias', 'value': '', 'layout': 'fieldStyle'});
            }
        }

        return (
            <div style={{padding:'5px'}}>
                <Form components={Components}  componentProps={ComponentProps}
                    defaults={defaults} submitUrl={this.props.submitUrl}  />
                <br/>
                <Button type={'success'} text={'Add New Field'} clickHandler={this.addField} />

                <Button type={'success'} text={'Add New Relation'} clickHandler={this.addRelated} />
            </div>
        );
    }
}


export default ModelMaker;
