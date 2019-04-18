import React, { Component } from 'react';
import {ListWithChildren, Link, Button} from 'library';


class InstanceList extends Component {

    render() {
        var dataMapping = {'link':'/instance/' + this.props.app + '/' + this.props.model + '/{id}/', 'text':'{unicode}', 'cssClass':"list-group-item"};

        return (
            <div className="container list-group">
              <ListWithChildren dataUrl={"/api/" + this.props.app + "/" + this.props.model + "/"} title={'Instances: ' + this.props.app + '/' + this.props.model} objectName={this.props.model} dataMapping={dataMapping}>
                <Link />
              </ListWithChildren>
              <Button type={'success'} text={'Add New'} href={"/instance/" + this.props.app + "/" + this.props.model + "/"} />
            </div>
        );
    }
}

export default InstanceList;
