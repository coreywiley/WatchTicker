import React, { Component } from 'react';
import List from '../library/list.js';
import Link from '../library/link.js';


class InstanceList extends Component {

    render() {
        var dataMapping = {'link':'/instance/' + this.props.app + '/' + this.props.model + '/{id}/', 'text':'{unicode}'};
        return (

            <List dataUrl={"/api/" + this.props.app + "/" + this.props.model + "/"} title={'Instances: ' + this.props.app + '/' + this.props.model} component={Link} objectName={this.props.model} dataMapping={dataMapping} />
        );
    }
}

export default InstanceList;