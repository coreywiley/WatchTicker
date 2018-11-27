import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker} from 'library';

class EditQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {'name' : '', 'factoid' : '', 'user':this.props.user.id};

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount(value) {
        if(this.props.question_id) {
          ajaxWrapper('GET','/api/home/question/' + this.props.question_id + '/', {}, this.objectCallback);
        }
        else {
          this.setState({loaded:true})
        }
    }

    objectCallback(result) {
      var question = result[0]['question'];
      question['loaded'] = true;
      question['question'] = question['id']
      this.setState(question)
    }

    render() {

      var defaults = this.state;

      var componentList = [{'component':Header, 'props': {'text':this.state.name, 'size':3}}]
      if (this.state.component == 'TextInput') {
        var props = JSON.parse(this.state.props);
        props['name'] = 'input';
        defaults['input'] = '';
        componentList.push({'component':TextInput, 'props': props})
      }

      var Components = [];
      var ComponentProps = [];

      for (var index in componentList) {
        var component = componentList[index];
        Components.push(component.component)
        ComponentProps.push(component.props)
      }

        var submitUrl = "/api/home/answer/";
        if (this.props.answer_id) {
          submitUrl += this.props.answer_id + '/';
        }

        var deleteUrl = undefined;
        var content = <div className="container">
                <Form components={Components} redirectUrl={"/question/{id}/"} objectName={'question'} componentProps={ComponentProps} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} />
                <br />
        </div>;

        return (
          <div>
            <Wrapper loaded={this.state.loaded} content={content} />
          </div>
             );
    }
}
export default EditQuestion;
