import React, { Component } from 'react';

import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';
import Card from '../library/card.js';
import List from '../library/list.js';



class ComponentList extends Component {

    render() {
        var lastInstanceData = {'name':"Something New?", 'description':"Add A New Component", 'link':"/component/", 'button':"Create New", 'button_type':"success"};
        var extraInfo = {'button_type':'primary', 'button':'Edit', 'link':'/component/{id}/'};
        return (

            <List dataUrl={"/models/getModelInstanceJson/home/component/"} component={Card} objectName={'component'} extraInfo={extraInfo} lastInstanceData={lastInstanceData} />
        );
    }
}

export default ComponentList;
