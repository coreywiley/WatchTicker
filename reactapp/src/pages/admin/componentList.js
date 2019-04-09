import React, { Component } from 'react';

import {ajaxWrapper} from 'functions';
import {Wrapper} from 'library';
import {Card, List} from 'library';


class ComponentList extends Component {

    render() {
        var lastInstanceData = {'name':"Something New?", 'description':"Add A New Component", 'link':"/component/", 'button':"Create New", 'button_type':"success"};
        var dataMapping = {'button_type':'primary', 'button':'Edit', 'link':'/component/{id}/'};
        return (

            <List dataUrl={"/api/home/component/"} component={Card} objectName={'component'} dataMapping={dataMapping} lastInstanceData={lastInstanceData} />
        );
    }
}

export default ComponentList;
