import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker, Checkbox} from 'library';

class EditQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {'name' : '', 'factoid' : '', 'component' : '', 'props' : '', 'loaded':false};

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
          if (index == 'options') {
            var options = [];
            var split = state[index].split(',');
            for (var i in split) {
              options.push({'text':split[i].trim(), 'value':split[i].trim()})
            }
            props[index] = options;
          }
          else {
            props[index] = state[index]
          }
        }
        newState[index] = state[index]
      }

      newState['props'] = JSON.stringify(props);
      console.log("Props Complete", props, newState['props'])
      this.setState(newState)
    }

    objectCallback(result) {
      var question = result[0]['question'];
      var props = JSON.parse(question['props'])

      for (var index in props) {
        if (index == 'options') {
          var options = [];
          for (var i in props[index]) {
            options.push(props[index][i]['value']);
          }
          question[index] = options.join(',')
        }
        else {
          question[index] = props[index]
        }
      }

      question['loaded'] = true;
      this.setState(question)
    }

    render() {

			var Components = [TextInput, TextArea, Select];

			var name = {'name': 'name', 'label': 'Question', 'placeholder': 'How old are you?', 'value': ''};
			var factoid = {'name': 'factoid', 'label': 'Factoid', 'placeholder': 'If you are over 50, you are 5% more likely to contract breast cancer.', 'value': ''};
			var component = {'name': 'component', 'label': 'Answer Type', 'defaultoption': '', 'options': [{'text': 'Select','value': 'Select'},{'text': 'Select Multiple','value': 'MultiSelect'},{'text': 'Short Text Input','value':'TextInput'},{'text':'Long Text Input','value':'TextArea'},{'text': 'Date/Time Picker','value':'DateTimePicker'}]};
			var ComponentProps = [name, factoid, component];
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
      else if (this.state.component == 'DateTimePicker') {
        Components.push(Header)
        ComponentProps.push({'text':'Answer Details', 'size':4})

        if (!defaults['display_time']) {
          defaults['display_time'] = false;
        }
        Components.push(Checkbox)
        ComponentProps.push({'name':'display_time', 'label':'Select Time?','checked':defaults['display_time']})

        if (!defaults['display_date']) {
          defaults['display_date'] = true;
        }
        Components.push(Checkbox)
        ComponentProps.push({'name':'display_date', 'label':'Select Date?','checked':defaults['display_date']})

      }
      else if (this.state.component == 'Select') {
        Components.push(Header)
        ComponentProps.push({'text':'Answer Details', 'size':4})
        Components.push(TextArea)
        ComponentProps.push({'name':'options', 'label':'Add All The Choices, seperated by commas. Other (Specify/Date) will allow you to fill out an option.', 'placeholder':'Choice 1,Choice 2,...'})
        if (!defaults['options']) {
          defaults['options'] = '';
        }
      }
      else if (this.state.component == 'MultiSelect') {
        Components.push(Header)
        ComponentProps.push({'text':'Answer Details', 'size':4})
        Components.push(TextArea)
        ComponentProps.push({'name':'options', 'label':'Add All The Choices, seperated by commas. Other (Specify/Date) will allow you to fill out an option.', 'placeholder':'Choice 1,Choice 2,...'})
        if (!defaults['options']) {
          defaults['options'] = '';
        }
      }



        var submitUrl = null;
        if (this.state.props != '') {
          var submitUrl = "/api/home/question/";
          if (this.props.question_id) {
            submitUrl += this.props.question_id + '/';
          }
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
                <Form components={Components} redirectUrl={"/questionList/"} objectName={'question'} componentProps={ComponentProps} setGlobalState={this.setGlobalState} autoSetGlobalState={true} globalStateName={'question'} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} />
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
