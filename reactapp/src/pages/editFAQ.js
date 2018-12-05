import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker, Checkbox} from 'library';

class EditQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {'question' : '', 'answer' : '', 'loaded':false};

        this.objectCallback = this.objectCallback.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);
    }

    componentDidMount(value) {
        if(this.props.faq_id) {
          ajaxWrapper('GET','/api/home/faq/' + this.props.faq_id + '/', {}, this.objectCallback);
        }
        else {
          this.setState({loaded:true})
        }
    }

    setGlobalState(name,state) {
      var props = {};
      var newState = {};
      for (var index in state) {
        newState[index] = state[index]
      }

      this.setState(newState)
    }

    objectCallback(result) {
      var question = result[0]['faq'];

      question['loaded'] = true;
      this.setState(question)
    }

    render() {

			var Components = [TextInput, TextArea];

			var question = {'name': 'question', 'label': 'Question', 'placeholder': 'How old are you?', 'value': ''};
			var answer = {'name': 'answer', 'label': 'Answer', 'placeholder': 'If you are over 50, you are 5% more likely to contract breast cancer.', 'value': ''};

      var ComponentProps = [question,answer]
      var defaults = this.state;

        var submitUrl = null;
        if (this.state.props != '') {
          var submitUrl = "/api/home/faq/";
          if (this.props.faq_id) {
            submitUrl += this.props.faq_id + '/';
          }
        }

        var deleteUrl = undefined;
        if (this.props.faq_id) {
          deleteUrl = "/api/home/faq/" + this.props.faq_id + "/delete/";
        }


        var title = <Header text={'Create New FAQ'} size={2} />
        if (this.props.faq_id) {
          title = <Header text={'Edit FAQ: ' + this.state.name} size={2} />
        }


        var content = <div className="container">
                {title}
                <Form components={Components} redirectUrl={"/faqList/"} objectName={'question'} componentProps={ComponentProps} setGlobalState={this.setGlobalState} autoSetGlobalState={true} globalStateName={'question'} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} />
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
