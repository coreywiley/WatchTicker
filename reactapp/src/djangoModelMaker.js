import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';

import {
  FormWithChildren, TextInput, Select, PasswordInput,
  Header, TextArea, NumberInput, DateTimePicker,
  ButtonGroup, Button, Accordion, LineBreak, Alert, Wrapper
} from 'library';


var MODEL_TYPES = [
    {'text':'Boolean', 'value':'Boolean'},
    {'text':'Datetime', 'value':'Datetime'},
    {'text':'Decimal', 'value':'Decimal'},
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
            alerts: [],
        };

        this.objectCallback = this.objectCallback.bind(this);
        this.addModel = this.addModel.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.saveModel = this.saveModel.bind(this);
    }

    componentDidMount() {
        ajaxWrapper('GET','/api/modelConfig/', {}, this.objectCallback);
    }

    refreshData(){
        ajaxWrapper('GET','/api/modelConfig/', {}, this.objectCallback);

        var alerts = this.state.alerts;
        alerts.push({'text': "Saved Successfully"});

        this.setState({
            alerts: alerts
        });
    }

    objectCallback(result) {
        var names = [];
        for (var i=0; i<result.length; i++){
            names.push({'text':result[i]['name'], 'value':result[i]['name']});
        }

        result.sort(this.compareOrder);

        this.setState({
            'configs': result,
            'loaded': true,
            'relatedNames': names,
        });
    }

    compareOrder(a, b){
        if (a.order > b.order) return 1;
        if (b.order > a.order) return -1;

        return 0;
    }

    addModel(event){
        var configs = this.state.configs;
        configs.push({
            'name':'',
            'order': this.state.configs.length,
            'data': {
                'fields':[],
                'related':[],
            },
        });

        this.setState({
            configs: configs,
        });
    }

    saveModel(data){
        var submitUrl = "/api/modelConfig/";

        if ('id' in data){
            for (var i in this.state.configs){
                var config = this.state.configs[i];
                if (config['name'] == data['name'] && config['id'] != data['id']){
                    alert('No duplicate names');
                    return false;
                }
            }
        } else {
            for (var i in this.state.configs){
                var config = this.state.configs[i];
                if (config['name'] == data['name']){
                    alert('No duplicate names');
                    return false;
                }
            }
        }
        ajaxWrapper("POST", submitUrl, data, this.refreshData);
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
                refreshData: this.refreshData,
                saveModel: this.saveModel,
            };

            var name = "Model";
            if (config.name != ''){
                name = config.name;
            }

            var container = <Accordion names={[name]} open={[true]} ComponentList={[ConfigForm]} ComponentProps={[formProps]} />

            forms.push(container);
        }

        var alerts = [];
        for (var i in this.state.alerts){
            alerts.push(<Alert {...this.state.alerts[i]} />);
        }

        var title = <Header text={'Django Model Configuration'} size={2} />;
        var content =
            <div className="container">
                <div className="row">
                    <div className="col-12"><br/><br/></div>
                    <div className="col-12">
                        {title}
                        {alerts}
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
        this.removeField = this.removeField.bind(this);
        this.addRelated = this.addRelated.bind(this);

        this.updateState = this.updateState.bind(this);
    }

    componentDidMount(){
        this.createDefaults();
    }

    createDefaults(){
        var config = this.props.config;
        var defaults = {
            name: config['name'],
            order: config['order'],
        };

        if ('id' in this.props.config){
            defaults['id'] = this.props.config['id'];
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

    removeField(event){
        var num = event.currentTarget;
        var data = this.state.data;
        data['fields'].splice(num, 1);

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

        var Components = [<TextInput name='name' label='Name' placeholder='Name' value='' layout='col-6 inlineField' />];

        Components.push(<NumberInput name='order' label='Order' placeholder='Order' value='' layout='col-6 inlineField' />);

        if ('id' in this.props.config){
            Components.push(<TextInput name='id' layout='hidden' />);
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

                Components.push(<TextInput name={'field_name_' + j} label='Name' placeholder='Name' value='' layout='fieldStyle inlineField' />);

                Components.push(<Select name={'field_type_' + j} label='Type' options={MODEL_TYPES} layout='fieldStyle inlineField' />);

                Components.push(<TextInput name={'field_default_' + j} label='Default' placeholder='Default' value='' layout='fieldStyle inlineField' />);

                Components.push(<ButtonGroup name={'field_blank_' + j} label='Blank' options={['True', 'False']} type='secondary' layout='fieldStyle inlineField' />);

                if (this.state.modelForm['field_type' + "_" + j] == "Char"){
                    Components.push(<NumberInput name={'field_limit_' + j} label='Max Length' layout='fieldStyle inlineField' />);
                }

                Components.push(<Button type='danger' text='X' num={j} onClick={this.removeField} />);

                Components.push(<LineBreak />);

            }

            Components.push(<Button type='success' text='Add New Field' onClick={this.addField} />);

            Components.push(<LineBreak />);
            Components.push(<LineBreak />);



            var related = [];
            if (config['data']['related']){
                related = config['data']['related'];
            }

            if (related.length > 0){
                Components.push(<Header text='Related Config' size={5} layout='fieldStyle' />);
            }

            for (var j=0; j < related.length; j++){
                var field = related[j];
                var fieldStyle = {'marginLeft': '25px'};

                Components.push(<TextInput name={'related_name_' + j} label='Name' placeholder='Name' value='' layout='fieldStyle inlineField' />);

                Components.push(<Select name={'related_model_' + j} label='Model' options={this.props.relatedNames} layout='fieldStyle inlineField' />);

                Components.push(<TextInput name={'related_alias_' + j} label='Related Name' placeholder='Alias' value='' layout='fieldStyle inlineField' />);

                Components.push(<LineBreak />);
            }
            Components.push(<Button type='success' text='Add New Relation' onClick={this.addRelated} />);

            Components.push(<LineBreak />);
            Components.push(<LineBreak />);

        }

        var deleteUrl = undefined;
        if ('id' in this.props.config) {
          deleteUrl = "/api/modelConfig/" + this.props.config.id + "/delete/";

        }

        var deleteUrl = undefined;
        if ('id' in this.props.config) {
          deleteUrl = "/api/modelConfig/" + this.props.config.id + "/delete/";
        }

        return (
            <div style={{padding:'5px'}}>
                <FormWithChildren defaults={defaults} submitUrl={this.props.submitUrl} redirect={this.props.refreshData}
                    autoSetGlobalState={true} globalStateName={'modelForm'} setGlobalState={this.updateState}
                    submit={this.props.saveModel} deleteUrl={deleteUrl}>
                    {Components}
                </FormWithChildren>
                <br/>
            </div>
        );
    }
}


export default ModelMaker;
