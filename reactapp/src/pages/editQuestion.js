import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker} from 'library';

class EditQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {'name' : '', 'factoid' : '', 'order' : 'true', 'component' : '', 'props' : ''};

        this.objectCallback = this.objectCallback.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);
    }

    componentDidMount(value) {
        if(this.props.question_id) {
          ajaxWrapper('GET','/api/home/question/' + this.props.question_id + '/', {}, this.objectCallback);
        }
        else {
          this.setState({loaded:true})
        }
    }

    setGlobalState(name,state) {
      var props = {};
      var newState = {};
      for (var index in state) {
        if (['name','factoid','order','component','props','required','loaded'].indexOf(index) == -1) {
          console.log("Prop Incoming", index, props)
          props[index] = state[index]
        }

        newState[index] = state[index]

      }

      newState['props'] = JSON.stringify(props);
      console.log("Props Complete", props, newState['props'])
      this.setState(newState)
    }

    objectCallback(result) {
      var question = result[0]['question'];
      question['loaded'] = true;
      this.setState(question)
    }

    render() {

			var Components = [TextInput, TextArea, NumberInput, Select];

			var name = {'name': 'name', 'label': 'Question', 'placeholder': 'How old are you?', 'value': ''};
			var factoid = {'name': 'factoid', 'label': 'Factoid', 'placeholder': 'If you are over 50, you are 5% more likely to contract breast cancer.', 'value': ''};
			var order = {'name': 'order', 'label': 'Order', 'placeholder': 1, 'value': 0};
			var component = {'name': 'component', 'label': 'Answer Type', 'defaultoption': 'Select', 'options': [{'text': 'Select','value': 'Select'},{'text': 'Short Text Input','value':'TextInput'},{'text':'Long Text Input','value':'TextArea'},{'text': 'Date/Time Picker','value':'DateTimePicker'}]};
			var ComponentProps = [name, factoid, order, component];
      var defaults = this.state;

      if (this.state.component == 'TextInput') {
        Components.push(Header)
        ComponentProps.push({'text':'Answer Details', 'size':4})
        Components.push(TextInput)
        ComponentProps.push({'name':'placeholder', 'label':'Placeholder Text'})
        if (!defaults['placeholder']) {
          defaults['placeholder'] = '';
        }
      }
      else if (this.state.component == 'TextArea') {
        Components.push(Header)
        ComponentProps.push({'text':'Answer Details', 'size':4})
        Components.push(TextInput)
        ComponentProps.push({'name':'placeholder', 'label':'Placeholder Text'})
        if (!defaults['placeholder']) {
          defaults['placeholder'] = '';
        }
      }



        var submitUrl = null;
        if (this.state.props != '') {
          var submitUrl = "/api/home/question/";
        }
        else if (this.props.question_id) {
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
                <Form components={Components} redirectUrl={"/question/{id}/"} objectName={'question'} componentProps={ComponentProps} setGlobalState={this.setGlobalState} autoSetGlobalState={true} globalStateName={'question'} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} />
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
