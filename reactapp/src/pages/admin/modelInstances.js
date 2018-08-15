import React, { Component } from 'react';
import {List, Link, Button} from 'library';
import Nav from 'projectLibrary/nav.js';

class InstanceList extends Component {

    render() {
        var dataMapping = {'link':'/instance/' + this.props.app + '/' + this.props.model + '/{id}/', 'text':'{unicode}', 'cssClass':"list-group-item"};

        return (
            <div className="container list-group">
              <Nav token={this.props.user_id} logOut={this.props.logOut} />
              <List dataUrl={"/api/" + this.props.app + "/" + this.props.model + "/"} title={'Instances: ' + this.props.app + '/' + this.props.model} component={Link} objectName={this.props.model} dataMapping={dataMapping} />
              <Button type={'success'} text={'Add New'} href={"/instance/" + this.props.app + "/" + this.props.model + "/"} />
            </div>
        );
    }
}

export default InstanceList;
