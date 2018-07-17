import React, { Component } from 'react';
import List from '../library/list.js';
import Link from '../library/link.js';


class AppList extends Component {

    render() {
        var dataMapping = {'link':'/models/{name}/', 'text':'{name}', 'cssClass':"list-group-item"};
        return (
            <div className="container list-group">
                <List dataUrl={"/api/getApps/"} title={'Apps'} component={Link} objectName={'app'} dataMapping={dataMapping} />
            </div>
        );
    }
}

export default AppList;