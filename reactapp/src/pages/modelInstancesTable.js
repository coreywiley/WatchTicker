import React, { Component } from 'react';
import {List, Link, Button, Table} from 'library';
import ajaxWrapper from '../base/ajax.js';

class InstanceTable extends Component {
    constructor(props) {
      super(props);
      this.state = {
        tableHeaders:[],
        tableData:[],
        loaded:false,
      }
      this.tablifyData = this.tablifyData.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/' + this.props.app + '/' + this.props.model + '/',{}, this.tablifyData)
    }

    tablifyData(result) {
      console.log("Loaded")
      var tableHeaders = [];
      var tableData = [];

      for (var index in result) {
        var object = result[index][this.props.model];
        if (tableHeaders.length == 0) {
          for (var header in object) {
            tableHeaders.push(header);
          }
        }
        var dataArray = [];
        for (var headerIndex in tableHeaders) {
          dataArray.push(object[tableHeaders[headerIndex]].toString());
        }
        tableData.push(dataArray)
      }
      this.setState({tableHeaders:tableHeaders, tableData:tableData, loaded:true})
    }

    render() {
        var dataMapping = {'link':'/instance/' + this.props.app + '/' + this.props.model + '/{id}/', 'text':'{unicode}', 'cssClass':"list-group-item"};

        return (
            <div>
              <Table headers={this.state.tableHeaders} data={this.state.tableData} />
            </div>
        );
    }
}

export default InstanceTable;
