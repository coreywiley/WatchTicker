import React, { Component } from 'react';
import {ListWithChildren, Link, Navbar} from 'library';

class AppList extends Component {

    render() {
        var dataMapping = {'link':'/models/{name}/', 'text':'{name}', 'cssClass':"list-group-item"};

        return (
          <div>
            <div className="container list-group">
                <ListWithChildren dataUrl={"/api/getApps/"} title={'Apps'} objectName={'app'} dataMapping={dataMapping}>
                    <Link />
                </ListWithChildren>
            </div>
          </div>
        );
    }
}

export default AppList;
