import React, { Component } from 'react';
import {{IMPORTS}} from './library';


class Compiler extends Component {
    componentDidMount() {
        this.setState({...this.props.globalState});
    }

    resolveComponents(pageComponent){
        var pageComponent = JSON.parse(pageComponent);

        var props = pageComponent.component.componentProps;
        var data = pageComponent.data;

        for (var i=0; i<props.length; i++) {
            var prop = props[i].componentprop;

            if (prop.type == "Component"){
                data[prop.name] = this.getComponentByName(data[prop.name], {});
            } else if (prop.type == "Component List"){
                for (var i=0; i<data[prop.name].length; i++){
                    data[prop.name][i] = this.getComponentByName(data[prop.name][i], {});
                }
            } else if (prop.type == "String") {
                data[prop.name] == this.parseGlobalData(prop.type, data[prop.name]);
            }
        }
        return data;
    }

    parseGlobalData(type, data) {
        console.log("Parsing Gobal Var", data, type);
        //Split string into pieces using the variable starting char
        var dataSplit = data.split('{');
        //Add initial text to output
        var cleaned = dataSplit[0];
        //Search through string pieces to find closing tag
        for (var i=1; i<dataSplit.length; i++){
            var innerSplit = dataSplit.split('}');
            if (innerSplit.length > 1){
                var variable = innerSplit[0];
                if (variable.startsWith("GLOBAL")){
                    var value = this.state[variable];
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

    getComponentByName(name, params){
        {{RESOLVERS}}
    }

    render() {
        var content = [];
        var page = this.props.page;
        for (var i=0; i<page.pageComponents.length; i++){
            var pageComponent = page.pageComponents[i].pagecomponent;

            var data = this.resolveComponents(JSON.stringify(pageComponent));
            let ComponentPointer = this.getComponentByName(pageComponent.component.name, pageComponent.data);

            content.push(
                <ComponentPointer key={page.pageComponents[i].id} {...data} />
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
