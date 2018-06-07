import React, { Component } from 'react';
import List from '../library/list.js';
import Link from '../library/link.js';


class AppList extends Component {

    render() {
        var dataMapping = {'link':'/models/{name}/', 'text':'{name}'};
        return (

            <List dataUrl={"/api/getApps/"} title={'Apps'} component={Link} objectName={'app'} dataMapping={dataMapping} />
        );
    }
}

export default AppList;