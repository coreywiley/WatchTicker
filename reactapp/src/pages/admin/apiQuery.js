import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import {Wrapper} from 'library';
import {Form, NumberInput, BooleanInput, TextInput, Select, TextArea, FileInput, Button} from 'library';


let ComponentDict = {
    'AutoField': "TextInput",
    'CharField': "TextInput",
    'ForeignKey': "Select",
    'IntegerField': "TextInput",
    'TextField': "TextArea",
    'DecimalField':'NumberInput',
    'BooleanField':'BooleanInput',
    'ManyToManyField':'Select',
    'DateTimeField': 'TextInput',
};

class APIQuery extends Component {

    constructor(props) {
        super(props);
        this.state = {url: '/api/' + this.props.app + '/' + this.props.model.toLowerCase() + '/', result: '', loaded:false, fields:[]};

        this.setGlobalState = this.setGlobalState.bind(this);
        this.query = this.query.bind(this);
        this.queryCallback = this.queryCallback.bind(this);
        this.fieldCallback = this.fieldCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/' + this.props.app + '/' + this.props.model.toLowerCase() + '/fields/', {}, this.fieldCallback)
    }

    fieldCallback(result) {
      this.setState({fields:result, loaded:true})
    }

    setGlobalState(name, state) {
      this.setState(state)
    }

    query() {
      ajaxWrapper('GET',this.state.url, {}, this.queryCallback)
    }

    queryCallback(result) {
        this.setState({'result':JSON.stringify(result)});
    }

    render() {

        var Components = [TextInput]

        var url = {'value':'/api/home/', 'placeholder':'/api/home/', 'name':'url', 'label':'URL Query'}
        var ComponentProps = [url]

        var fields = [];

        for (var index in this.state.fields) {
          var field = this.state.fields[index];
          fields.push(<tr><th>{field[0]}</th><td>{field[1]}</td></tr>);
        }


        var normForm = <Form components={Components} autoSetGlobalState={true} setGlobalState={this.setGlobalState} globalStateName={'form'} componentProps={ComponentProps} defaults={this.state} />


        var content =
        <div>
          <table className="table">
            <tr>
              <th>Name</th>
              <th>Field Type</th>
            </tr>
            {fields}
          </table>

          {normForm}
          <Button text={'Query'} type={'success'} onClick={this.query} />
          <p>Result:</p>
          <p>{this.state.result}</p>
        </div>

        return (
            <div className="container">
                <Wrapper loaded={this.state.loaded} content={content} />
            </div>
             );
    }
}
export default APIQuery;
