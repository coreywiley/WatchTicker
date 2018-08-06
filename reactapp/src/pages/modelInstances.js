import React, { Component } from 'react';
import {List, Link} from 'library';


class InstanceList extends Component {

    render() {
        var dataMapping = {'link':'/instance/' + this.props.app + '/' + this.props.model + '/{id}/', 'text':'{unicode}', 'cssClass':"list-group-item"};
        return (
            <div className="container list-group">
                <List dataUrl={"/api/" + this.props.app + "/" + this.props.model + "/"} title={'Instances: ' + this.props.app + '/' + this.props.model} component={Link} objectName={this.props.model} dataMapping={dataMapping} />
            </div>
        );
    }
}

export default InstanceList;
