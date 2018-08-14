import React, { Component } from 'react';
import {List, Link} from 'library';
import Nav from '../projectLibrary/nav.js';

class ModelList extends Component {

    render() {
        var dataMapping = {'link':'/modelInstances/' + this.props.app + '/{name}/', 'text':'{name}', 'cssClass':"list-group-item"};
        return (
            <div className="container list-group">
                <Nav token={this.props.user_id} logOut={this.props.logOut} />
                <List dataUrl={"/api/getModels/" + this.props.app + "/"} title={'Models: ' + this.props.app} component={Link} objectName={'model'} dataMapping={dataMapping} />
            </div>
        );
    }
}

export default ModelList;
