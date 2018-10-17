import React, { Component } from 'react';
import {List, Link, Navbar} from 'library';
import Nav from 'projectLibrary/nav.js';

class AppList extends Component {

    render() {
        var dataMapping = {'link':'/models/{name}/', 'text':'{name}', 'cssClass':"list-group-item"};

        return (
          <div>
            <div className="container list-group">
                <List dataUrl={"/api/getApps/"} title={'Apps'} component={Link} objectName={'app'} dataMapping={dataMapping} />
            </div>
          </div>
        );
    }
}

export default AppList;
