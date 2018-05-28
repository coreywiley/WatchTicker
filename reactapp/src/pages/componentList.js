import React, { Component } from 'react';

import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';
import Card from '../components/card.js';

class ComponentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            components: []
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper("GET", "/api/components/", {}, this.ajaxCallback);
    }

    ajaxCallback(value){
        console.log(value);

        this.setState({
            components: value.components,
            loaded: true
        });
    }

    render() {
        var content = [];
        for (var i = 0; i < this.state.components.length; i++){
            var data = this.state.components[i];
            var componentSmall = <Card name={data.name} description={data.description} link={"/component/" + data.id} button='Edit' button_type="primary" />;

            content.push(componentSmall);
        }
        var componentSmall = <Card name="Something New?" description="Add A New Component" link="/component/-1/" button="Create New" button_type="success" />;

        content.push(componentSmall);


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
        );
    }
}

export default ComponentList;
