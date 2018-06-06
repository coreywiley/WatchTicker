import React, { Component } from 'react';
import {{IMPORTS}} from './library';


class Compiler extends Component {
    resolveComponentsInProps(data){
        var props = data.component.componentProps;
        for (var i=0; i<props.length; i++) {
            if (props[i].type == "Component"){
                data[props[i].name] = this.getComponentByName(data[props[i].name], {});
            }
        }
        return data;
    }

    getComponentByName(name, params){
        {{RESOLVERS}}
    }

    render() {
        var content = [];
        var page = this.props.page;
        for (var i=0; i<page.pageComponents.length; i++){
            var pageComponent = page.pageComponents[i].pagecomponent;

            var data = this.resolveComponentsInProps(pageComponent);

            content.push(
                this.getComponentByName(pageComponent.component.name, pageComponent.data)
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
