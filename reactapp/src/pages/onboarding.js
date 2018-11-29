import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker, Button} from 'library';

class OnBoarding extends Component {
    constructor(props) {
        super(props);

        this.state = {'questions' : [], 'currentQuestion' : 0, 'user':this.props.user.id, loaded:false};
        this.objectCallback = this.objectCallback.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
    }

    componentDidMount(value) {
        ajaxWrapper('GET','/api/home/question/?order_by=preview_order&preview_archived=false', {}, this.objectCallback);
    }

    objectCallback(result) {
      var newState = {};
      var questions = [];
      for (var index in result) {
        var question = result[index]['question'];
        question['question'] = question['id']
        questions.push(question)
      }
      newState['loaded'] = true;
      newState['questions'] = questions;
      console.log("Object Callback", newState)
      this.setState(newState)
    }

    next() {
      if (this.state.currentQuestion == this.state.questions.length -1) {
        window.close();
      }
      else {
        this.setState({'currentQuestion': this.state.currentQuestion + 1})
      }

    }

    prev() {
      this.setState({'currentQuestion': this.state.currentQuestion - 1})
    }

    render() {

      if (this.state.loaded) {
        console.log("Questions", this.state.questions, this.state.currentQuestion)
        var question = this.state.questions[this.state.currentQuestion]
        var defaults = question;

        var componentList = [{'component':Header, 'props': {'text':this.state.name, 'size':3}}]
        if (question.component == 'TextInput') {
          var props = JSON.parse(question.props);
          props['name'] = 'input';
          defaults['input'] = '';
          componentList.push({'component':TextInput, 'props': props})
        }
        if (question.component == 'TextArea') {
          var props = JSON.parse(question.props);
          props['name'] = 'input';
          defaults['input'] = '';
          componentList.push({'component':TextArea, 'props': props})
        }

        else if (question.component == 'DateTimePicker') {
          var props = JSON.parse(question.props);
          if (props['display_date'] == "true") {
            props['display_date'] = true;
          }
          else if (props['display_date'] == "false") {
            props['display_date'] = false;
          }

          if (props['display_time'] == "true") {
            props['display_time'] = true;
          }
          else if (props['display_time'] == "false") {
            props['display_time'] = false;
          }

          props['name'] = 'input';
          defaults['input'] = '';
          componentList.push({'component':DateTimePicker, 'props': props})

        }
        else if (question.component == 'Select') {
          var props = JSON.parse(question.props);
          props['name'] = 'input';
          defaults['input'] = '';
          componentList.push({'component':Select, 'props': props})
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
                  <Header size={4} text={question.name} />
                  <Form components={Components} redirectUrl={"/question/{id}/"} objectName={'question'} componentProps={ComponentProps} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} />
                  <br />
          </div>;

          var next = <Button type ={'success'} text={'Next Question'} clickHandler={this.next} />
          if (this.state.currentQuestion == this.state.questions.length - 1) {
            next = <Button type ={'success'} text={'Complete OnBoarding'} clickHandler={this.next} />
          }

          var prev = <Button type ={'danger'} text={'Previous Question'} clickHandler={this.prev} />
          if (this.state.currentQuestion == 0) {
            prev = null;
          }
          return (
            <div className="container">
              <Wrapper loaded={this.state.loaded} content={content} />
              {prev}
              {next}
            </div>
               );
        }
        else {
          return (
            <div>
              <Wrapper loaded={this.state.loaded} content={null} />
            </div>
               );
        }


    }
}
export default OnBoarding;
