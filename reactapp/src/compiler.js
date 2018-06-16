 import React, { Component } from 'react';
import getComponent from './componentResolver.js';
import Wrapper from './base/wrapper.js';


class Compiler extends Component {
    constructor(props) {
        super(props);
        this.state = {...this.props.globalState};
        this.state['setGlobalState'] = this.setGlobalState.bind(this);
    }

    resolvePageComponent(pageComponent){
        var pageComponent = JSON.parse(pageComponent);
        var props = this.props.components[pageComponent.component_id].componentProps;
        var data = pageComponent.data;

        data = this.findComponents(props, data);
        return data;
    }

    findComponents(props, startData){
        var endData = JSON.parse(JSON.stringify(startData));

        for (var i=0; i<props.length; i++) {
            var prop = props[i].componentprop;
            if (!(prop.name in startData)){
                continue;
            }

            if (prop.type == "Component"){
                endData[prop.name] = getComponent("name", startData[prop.name]);

            } else if (prop.type == "Component List"){
                for (var j=0; j<startData[prop.name].length; j++){
                    endData[prop.name][j] = getComponent("name", startData[prop.name][j]);
                }
            } else if (prop.type == "Dictionary" || prop.type == "List") {
                if (prop.name == "dataMapping" || prop.name == "lastInstanceData"){
                    var newProps = this.props.componentsByName[startData['component']].componentProps;
                    var newData = startData[prop.name];
                    endData[prop.name] = this.findComponents(newProps, newData);
                } else {
                    endData[prop.name] = this.diveDeeper(startData[prop.name]);
                }

            } else {
                endData[prop.name] = this.parseGlobalData(prop.type, startData[prop.name]);
            }
        }
        return endData;
    }

    diveDeeper(data){
        var value = {};
        for (var key in data) {
            if (typeof(data[key]) == "string"){
                value[key] = this.parseGlobalData('', data[key]);
            } else if (typeof(data[key]) == "object"){
                value[key] = this.diveDeeper(data[key]);
            }
        }

        return value;
    }


    parseGlobalData(type, data) {
        if (typeof data != 'string') {
            return data;
        }
        
        console.log("Parsing Gobal Var", data, type);
        //Split string into pieces using the variable starting char
        var dataSplit = data.split('{');
        //Add initial text to output
        var cleaned = dataSplit[0];
        //Search through string pieces to find closing tag
        for (var i=1; i<dataSplit.length; i++){
            var innerSplit = dataSplit[i].split('}');
            if (innerSplit.length > 1){
                var variable = innerSplit[0].split('.');

                if (variable == ["GLOBAL", "setGlobalState"]){
                    cleaned = this.state.setGlobalState;

                } else if (variable[0] == "GLOBAL"){
                    var value = this.state;
                    for (var j=1; j<variable.length; j++){
                        if (variable[j] in value){
                            value = value[variable[j]];
                        } else {
                            value = '';
                            break;
                        }
                    }
                    if (cleaned == "" && innerSplit[1] == ""){
                        cleaned = value;
                    } else {
                        cleaned += value + innerSplit[1];
                    }
                } else {
                    cleaned += "{"+innerSplit[0]+"}" + innerSplit[1];
                }
            } else {
                cleaned += innerSplit[0];
            }
        }

        return cleaned;
    }

    setGlobalState(componentName, value) {
        console.log("Global State Change",componentName,value);
        var newState = {};
        newState[componentName] = value;
        this.setState(newState);
    }

    render() {
        var content = [];
        var page = this.props.page;
        var components = Object.assign([], page.pageComponents);
        components.sort(function(a, b){
            return a['pagecomponent']['order'] - b['pagecomponent']['order'];
        });

        for (var i=0; i<components.length; i++){
            var pageComponent = components[i].pagecomponent;

            var data = this.resolvePageComponent(JSON.stringify(pageComponent));
            let ComponentPointer = getComponent("id", pageComponent.component_id);

            content.push(
                <ComponentPointer key={components[i].id} setGlobalState={this.setGlobalState.bind(this)} {...data} />
            );

        }

        return (
            <Wrapper loaded={true} content={content} />
        );
    }
}

export default Compiler;
