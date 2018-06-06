import React, { Component } from 'react';
import {{IMPORTS}} from './library';


class Compiler extends Component {
    resolveComponentsInProps(pageComponent){
        var props = pageComponent.component.componentProps;
        var data = pageComponent.data;

        for (var i=0; i<props.length; i++) {
            var prop = props[i].componentprop;

            if (prop.type == "Component"){
                data[prop.name] = this.getComponentByName(data[prop.name], {});
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
