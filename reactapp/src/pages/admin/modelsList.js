import React, { Component } from 'react';
import {ListWithChildren, Link} from 'library';


class ModelList extends Component {

    render() {
        var dataMapping = {'link':'/modelInstances/' + this.props.app + '/{name}/', 'text':'{name}', 'cssClass':"list-group-item"};
        return (
            <div className="container list-group">
                <ListWithChildren dataUrl={"/api/getModels/" + this.props.app + "/"} title={'Models: ' + this.props.app} objectName={'model'} dataMapping={dataMapping}>
                    <Link />
                </ListWithChildren>
            </div>
        );
    }
}

export default ModelList;
