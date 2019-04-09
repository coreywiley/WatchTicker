import React, { Component } from 'react';
import {List, Link, Button, Table} from 'library';
import {ajaxWrapper} from 'functions';

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
      console.log(result);
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
        console.log("Table Headers", tableHeaders)
        console.log("Object",object)
        var dataArray = [];
        for (var headerIndex in tableHeaders) {
          console.log("Data Array To Push", object[tableHeaders[headerIndex]])
          if (object[tableHeaders[headerIndex]] == null || object[tableHeaders[headerIndex]] == undefined) {
            dataArray.push("");
          }
          else {
            dataArray.push(object[tableHeaders[headerIndex]].toString());
          }
        }
        tableData.push(dataArray)
      }
      this.setState({tableHeaders:tableHeaders, tableData:tableData, loaded:true})
    }

    render() {
        var dataMapping = {'link':'/instance/' + this.props.app + '/' + this.props.model + '/{id}/', 'text':'{unicode}', 'cssClass':"list-group-item"};

        if (this.state.loaded == true) {
        return (
            <div>
              <Table headers={this.state.tableHeaders} data={this.state.tableData} />
            </div>
        );
      }
      else {
        return (
            <div>
              
            </div>
        );
      }
    }
}

export default InstanceTable;
