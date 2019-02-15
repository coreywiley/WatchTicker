import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {
  Form, TextInput, Select, PasswordInput,
  Header, TextArea, NumberInput, DateTimePicker,
  ButtonGroup, Button, Accordion, LineBreak
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
        this.refreshData = this.refreshData.bind(this);
    }

    componentDidMount() {
        ajaxWrapper('GET','/api/modelConfig/', {}, this.objectCallback);
    }

    refreshData(){
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

            var formProps = {
                config: config,
                submitUrl: submitUrl,
                relatedNames: this.state.relatedNames,
                refreshData: this.refreshData
            };

            var name = "Model";
            if (config.name != ''){
                name = config.name;
            }

            var container = <Accordion names={[name]} open={[true]} ComponentList={[ConfigForm]} ComponentProps={[formProps]} />

            forms.push(container);
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
                        <Button type={'success'} text={'Add New Model'} onClick={this.addModel} />
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
        this.state = {
            modelForm: {}
        };

        this.addField = this.addField.bind(this);
        this.addRelated = this.addRelated.bind(this);

        this.updateState = this.updateState.bind(this);
    }

    componentDidMount(){
        this.createDefaults();
    }

    createDefaults(){
        var config = this.props.config;
        var defaults = {name: config['name']};

        if (config['id']){
            defaults['id'] = config['id'];
        }

        if (config['data']){
            var fields = [];
            if (config['data']['fields']){
                fields = config['data']['fields'];
            }

            for (var j=0; j < fields.length; j++){
                var field = fields[j];
                defaults["field_name" + "_" + j] = field['name'];
                defaults["field_type" + "_" + j] = field['type'];
                defaults["field_default" + "_" + j] = field['default'];
                defaults["field_blank" + "_" + j] = field['blank'];
                if (this.state.modelForm['field_type' + "_" + j] == "Char"){
                    defaults["field_limit" + "_" + j] = field['limit'];
                }
            }

            var related = [];
            if (config['data']['related']){
                related = config['data']['related'];
            }

            for (var j=0; j < related.length; j++){
                var field = related[j];
                defaults["related_name" + "_" + j] = field['name'];
                defaults["related_model" + "_" + j] = field['model'];
                defaults["related_alias" + "_" + j] = field['alias'];
            }
        }

        var newState = Object.assign(this.props.config);
        newState.modelForm = defaults;
        this.setState(newState);
    }

    updateState(name, state){
        var oldState = this.state;
        oldState[name] = state;
        this.setState(oldState);
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
        var defaults = this.state.modelForm;

        var name = {'name': 'name', 'label': 'Name', 'placeholder': 'Name', 'value': ''};

        var Components = [TextInput];
        var ComponentProps = [name];

        if (config['id']){
            var id = {'name': 'id', 'layout': 'hidden'};
            Components.push(TextInput);
            ComponentProps.push(id);
        }

        if (config['data']){
            var fields = [];
            if (config['data']['fields']){
                fields = config['data']['fields'];
            }
            for (var j=0; j < fields.length; j++){
                var field = fields[j];
                var fieldStyle = {'marginLeft': '25px'};

                //Components.push(Header);
                //ComponentProps.push({'text': 'Field Config', 'size': 5, 'layout': 'fieldStyle inlineField'});

                Components.push(TextInput);
                ComponentProps.push({'name': "field_name" + "_" + j, 'label': 'Name', 'placeholder': 'Name', 'value': '', 'layout': 'fieldStyle inlineField'});

                Components.push(Select);
                ComponentProps.push({'name': 'field_type' + "_" + j, 'label': 'Type', 'options': MODEL_TYPES, 'layout': 'fieldStyle inlineField'});

                Components.push(TextInput);
                ComponentProps.push({'name': "field_default" + "_" + j, 'label': 'Default', 'placeholder': 'Default', 'value': '', 'layout': 'fieldStyle inlineField'});

                Components.push(ButtonGroup);
                ComponentProps.push({'name': 'field_blank' + "_" + j, 'label': 'Blank', 'options': ['True', 'False'], 'type': 'secondary', 'layout': 'fieldStyle inlineField'});

                if (this.state.modelForm['field_type' + "_" + j] == "Char"){
                    Components.push(NumberInput);
                    ComponentProps.push({'name': 'field_limit' + "_" + j, 'label': 'Max Length', 'layout': 'fieldStyle inlineField'});
                }

                Components.push(LineBreak);
                ComponentProps.push({});
            }

            var related = [];
            if (config['data']['related']){
                related = config['data']['related'];
            }

            if (related.length > 0){
                Components.push(Header);
                ComponentProps.push({'text': 'Related Config', 'size': 5, 'layout': 'fieldStyle'});
            }

            for (var j=0; j < related.length; j++){
                var field = related[j];
                var fieldStyle = {'marginLeft': '25px'};

                Components.push(TextInput);
                ComponentProps.push({'name': "related_name" + "_" + j, 'label': 'Name', 'placeholder': 'Name', 'value': '', 'layout': 'fieldStyle inlineField'});

                Components.push(Select);
                ComponentProps.push({'name': 'related_model' + "_" + j, 'label': 'Model', 'options': this.props.relatedNames, 'layout': 'fieldStyle inlineField'});

                Components.push(TextInput);
                ComponentProps.push({'name': "related_alias" + "_" + j, 'label': 'Related Name', 'placeholder': 'Alias', 'value': '', 'layout': 'fieldStyle inlineField'});

                Components.push(LineBreak);
                ComponentProps.push({});
            }
        }

        return (
            <div style={{padding:'5px'}}>
                <Form components={Components}  componentProps={ComponentProps}
                    defaults={defaults} submitUrl={this.props.submitUrl} redirect={this.props.refreshData}
                    autoSetGlobalState={true} globalStateName={'modelForm'} setGlobalState={this.updateState} />
                <br/>
                <Button type={'success'} text={'Add New Field'} onClick={this.addField} />

                <Button type={'success'} text={'Add New Relation'} onClick={this.addRelated} />
            </div>
        );
    }
}


export default ModelMaker;
