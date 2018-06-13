import React, { Component } from 'react';
import getComponent from './componentResolver.js';


class Compiler extends Component {
    constructor(props) {
        super(props);
        this.state = {...this.props.globalState};
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

            if (prop.name == "dataMapping"){
                var newProps = this.props.componentsByName[startData['component']].componentProps;
                var newData = startData[prop.name];
                endData[prop.name] = this.findComponents(newProps, newData);

            } else if (prop.type == "Component"){
                endData[prop.name] = getComponent("name", startData[prop.name]);

            } else if (prop.type == "Component List"){
                for (var j=0; j<startData[prop.name].length; j++){
                    endData[prop.name][j] = getComponent("name", startData[prop.name][j]);
                }

            } else if (prop.type == "Dictionary") {
                for (var key in startData[prop.name]) {
                    if (typeof(startData[prop.name][key]) == "string"){
                        endData[prop.name][key] = this.parseGlobalData(prop.type, startData[prop.name][key]);
                    }
                }

            } else if (prop.type == "String" || prop.type == "URL") {
                endData[prop.name] = this.parseGlobalData(prop.type, startData[prop.name]);
            }
        }
        return endData;
    }

    parseGlobalData(type, data) {
        console.log("Parsing Gobal Var", data, type);
        //Split string into pieces using the variable starting char
        var dataSplit = data.split('{');
        //Add initial text to output
        var cleaned = dataSplit[0];
        //Search through string pieces to find closing tag
        for (var i=1; i<dataSplit.length; i++){
            var innerSplit = dataSplit[i].split('}');
            if (innerSplit.length > 1){
                var variable = innerSplit[0];
                if (variable.startsWith("GLOBAL") && this.state && variable.replace("GLOBAL.",'') in this.state){
                    var value = this.state[variable.replace("GLOBAL.",'')];
                    cleaned += value + innerSplit[1];
                } else {
                    cleaned += "{"+variable+"}" + innerSplit[1];
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
        for (var i=0; i<page.pageComponents.length; i++){
            var pageComponent = page.pageComponents[i].pagecomponent;

            var data = this.resolvePageComponent(JSON.stringify(pageComponent));
            let ComponentPointer = getComponent("id", pageComponent.component_id);

            content.push(
                <ComponentPointer key={page.pageComponents[i].id} setGlobalState={this.setGlobalState.bind(this)} {...data} />
            );

        }

        return (
            <div>
                {content}
            </div>
        );
    }
}

export default Compiler;
