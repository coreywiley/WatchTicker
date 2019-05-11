import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';

import {
  FormWithChildren, TextInput, Select, PasswordInput,
  Header, TextArea, NumberInput, DateTimePicker,
  ButtonGroup, Button, Accordion, LineBreak, Alert, Wrapper
} from 'library';

import ConfigForm from './model.js';

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
    }

    componentDidMount() {
        ajaxWrapper('GET','/api/modelWebsite/modelconfig/', {}, this.objectCallback);
    }

    refreshData() {
        console.log("Refreshing Data")
        ajaxWrapper('GET','/api/modelWebsite/modelconfig/', {}, this.objectCallback);

        var alerts = this.state.alerts;
        alerts.push({'text': "Saved Successfully"});

        this.setState({
            alerts: alerts
        });
    }

    objectCallback(result) {
        console.log("Result", result)
        var names = [];
        var configs = []

        for (var index in result) {
            var model = result[index]['modelconfig']
            names.push({'text':model['name'], 'value':model['name']});
            if (typeof(model.data) == 'string') {
                model.data = JSON.parse(model.data);
            }
            configs.push(model);
        }

        configs.sort(this.compareOrder);

        this.setState({
            'configs': configs,
            'loaded': true,
            'relatedNames': names,
        });
    }

    compareOrder(a, b){
        if (a.order > b.order) return 1;
        if (b.order > a.order) return -1;

        return 0;
    }

    addModel(event) {
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

    render() {
        var forms = [];

        var submitUrl = "/api/modelConfig/";
        for (var i in this.state.configs){
            var config = this.state.configs[i];

            var formProps = {
                config: config,
                relatedNames: this.state.relatedNames,
                refreshData: this.refreshData,
            };

            var name = "Model";
            if (config.name != '') {
                name = config.name;
            }

            var container = <Accordion names={[name]} open={[false]} ComponentList={[ConfigForm]} ComponentProps={[formProps]} />

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




export default ModelMaker;
