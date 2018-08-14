import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';
import ajaxWrapper from 'base/ajax.js';

class TableRow extends React.Component {
  render() {
    var data = []
    for (var index in this.props.data) {
      data.push(<td>{this.props.data[index]}</td>)
    }
    return (
      <tr>
        {data}
      </tr>
    )
  }
}

class Table extends React.Component {
  constructor(props) {
      super(props);
      this.state = {headers: this.props.headers, data:this.props.data};

      this.refreshData = this.refreshData.bind(this);
      this.refreshDataCallback = this.refreshDataCallback.bind(this);
  }

  componentDidMount() {
      console.log("Data URL", this.props.dataUrl);
      if (this.props.dataUrl) {
          this.refreshData();
      }
  }

  refreshData() {
      console.log("Refresh Data", this.props.dataUrl);
      if (this.props.dataUrl) {
          ajaxWrapper("GET",this.props.dataUrl, {}, this.refreshDataCallback);
      }
  }

  refreshDataCallback(value) {
      console.log("Form Data",value, this.props.objectName)
      var data = [];
      var newValue;
      for (var index in value) {
        newValue = resolveVariables(this.props.dataMapping, value[index][this.props.objectName]);
        console.log("Data Mapped", newValue)
        data.push(newValue)
      }
      this.setState({data:data})
  }

    render() {
        var headers = [];
        var rows = [];

        for (var index in this.state.headers) {
          headers.push(<th>{this.state.headers[index]}</th>)
        }

        for (var i in this.state.data) {
          rows.push(<TableRow data={this.state.data[i]} />)
        }

        if (headers.length == 0) {
          for (var index in this.props.headers) {
            headers.push(<th>{this.props.headers[index]}</th>)
          }

          for (var i in this.props.data) {
            rows.push(<TableRow data={this.props.data[i]} />)
          }
        }

        return (
            <table className='table'>
              <thead>
                <tr>
                  {headers}
                </tr>
              </thead>
              <tbody>
                {rows}
              </tbody>
            </table>
        );
    }
}

export default Table;
