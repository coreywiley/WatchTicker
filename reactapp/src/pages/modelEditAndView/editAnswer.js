import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker} from 'library';

class EditAnswer extends Component {
    constructor(props) {
        super(props);

        this.state = {'question' : '', 'answer' : '', 'user' : ''};

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount(value) {
        if(this.props.answer_id) {
          ajaxWrapper('GET','/api/home/answer/' + this.props.answer_id + '/', {}, this.objectCallback);
        }
        else {
          this.setState({loaded:true})
        }
    }

    objectCallback(result) {
      var answer = result[0]['answer'];
      answer['loaded'] = true;
      this.setState(answer)
    }

    render() {

				var Components = [Select, TextArea, Select, ];

			var question = {'name': 'question', 'label': 'Question', 'placeholder': 'Question', 'value': '', 'optionsUrl': '/api/home/question/', 'optionsUrlMap': {'text':'{question.unicode}','value':'{question.id}'}};
			var answer = {'name': 'answer', 'label': 'Answer', 'placeholder': 'Answer', 'value': ''};
			var user = {'name': 'user', 'label': 'User', 'placeholder': 'User', 'value': '', 'optionsUrl': '/api/user/user/', 'optionsUrlMap': {'text':'{user.unicode}','value':'{user.id}'}};
			var ComponentProps = [question, answer, user];

        var defaults = this.state;

        var submitUrl = "/api/home/answer/";
        if (this.props.answer_id) {
          submitUrl += this.props.answer_id + '/';
        }

        var deleteUrl = undefined;
        if (this.props.answer_id) {
          deleteUrl = "/api/home/answer/" + this.props.answer_id + "/delete/";
        }


        var title = <Header text={'Create New Answer'} size={2} />
        if (this.props.answer_id) {
          title = <Header text={'Edit Answer: ' + this.state.name} size={2} />
        }


        var content = <div className="container">
                {title}
                <Form components={Components} redirectUrl={"/answer/{id}/"} objectName={'answer'} componentProps={ComponentProps} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} />
                <br />
        </div>;

        return (
          <div>
            <Wrapper loaded={this.state.loaded} content={content} />
          </div>
             );
    }
}
export default EditAnswer;
