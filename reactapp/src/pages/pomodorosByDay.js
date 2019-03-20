
import React, { Component } from 'react';
import consolidate from 'base/consolidate.js';
import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class TableRows extends Component {
  render() {
    var rows = [];
    for (var index in this.props.data) {
      var data_row = this.props.data[index];
      var row_data = [];
      for (var j in data_row) {
        row_data.push(<td>{data_row[j]}</td>)
      }

      rows.push(<tr>{row_data}</tr>)
    }

    return(rows)

  }
}

class ListOf extends Component {
  constructor(props) {
    super(props);
    this.state = {'items':[]}
    this.objectCallback = this.objectCallback.bind(this);
  }

  componentDidMount() {
    ajaxWrapper('GET','/api/' + this.props.app + '/' + this.props.model + '/' + this.props.filters, {}, this.objectCallback)
  }

  objectCallback(result) {
    var items = [];
    for (var index in result) {
      items.push(result[index][this.props.model])
    }
    console.log("Before Consolidation")
    var newData = consolidate(items, this.props.consolidate_data)
    console.log("After Consolidation")
    this.setState({items:newData})
  }

  render() {
    var Component = this.props.component
    return (
        <Component data={this.state.items} />
    )
  }
}

class TaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {'pomodoros':[], loaded:true}
    }


    render() {

      var content =
        <div className="container">
          <Header size={2} text={'Pomodoro Analytics'} />
          <br />
          <table className='table'>
            <tr>
              <td>Date</td>
              <td>Number of Pomodoros</td>
            </tr>
            <tr>
              <th>Weekly Goal</th>
              <th>96</th>
            </tr>
            <ListOf component={TableRows} app={'home'} model={'pomodoro'} filters={'?task__user=' + this.props.user.id} consolidate_data={{'group_by':'{created_at}', 'add':1}} />
          </table>
        </div>;


        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default TaskList;
