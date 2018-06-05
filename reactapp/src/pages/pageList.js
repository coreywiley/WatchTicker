import React, { Component } from 'react';

import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';
import Card from '../library/card.js';
import List from '../library/list.js';



class PageList extends Component {

    render() {
        var lastInstanceData = {'name':"Something New?", 'description':"Add A New Page", 'link':"/page/", 'button':"Create New", 'button_type':"success"};
        var dataMapping = {'button_type':'primary', 'button':'Edit', 'link':'/page/{id}/'};
        return (
            <List dataUrl={"/api/home/page/"} component={Card} objectName={'page'} dataMapping={dataMapping} lastInstanceData={lastInstanceData} />
        );
    }
}

export default PageList;