import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker} from 'library';

class EditQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {'name' : '', 'factoid' : ''};

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
      this.setState(question)
    }

    render() {

				var Components = [TextInput, TextArea, ];

			var name = {'name': 'name', 'label': 'Name', 'placeholder': 'Name', 'value': ''};
			var factoid = {'name': 'factoid', 'label': 'Factoid', 'placeholder': 'Factoid', 'value': ''};
			var ComponentProps = [name, factoid];

        var defaults = this.state;

        var submitUrl = "/api/home/question/";
        if (this.props.question_id) {
          submitUrl += this.props.question_id + '/';
        }

        var deleteUrl = undefined;
        if (this.props.question_id) {
          deleteUrl = "/api/home/question/" + this.props.question_id + "/delete/";
        }


        var title = <Header text={'Create New Question'} size={2} />
        if (this.props.question_id) {
          title = <Header text={'Edit Question: ' + this.state.name} size={2} />
        }


        var content = <div className="container">
                {title}
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
