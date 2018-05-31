import React, { Component } from 'react';

import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';
import Card from '../library/card.js';

class PageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            pages: []
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper("GET", "/models/getModelInstanceJson/home/page/", {}, this.ajaxCallback);
    }

    ajaxCallback(value){
        console.log(value);

        this.setState({
            pages: value,
            loaded: true
        });
    }

    render() {
        var content = [];
        for (var i = 0; i < this.state.pages.length; i++){
            var data = this.state.pages[i]['page'];
            var pageSmall = <Card name={data.name} description={data.url} link={"/page/" + data.id} button='Edit' button_type="primary" />;

            content.push(pageSmall);
        }
        var pageSmall = <Card name="Something New?" description="Add A New Page" link="/page/" button="Create New" button_type="success" />;
        content.push(pageSmall);


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
        );
    }
}

export default PageList;
