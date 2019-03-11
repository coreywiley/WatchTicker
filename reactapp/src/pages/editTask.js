import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker} from 'library';

class EditTask extends Component {
    constructor(props) {
        super(props);

        this.state = {'name' : '', 'expected_pomodoros' : 0, 'user' : this.props.user.id};

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount(value) {
        if(this.props.task_id) {
          ajaxWrapper('GET','/api/home/task/' + this.props.task_id + '/', {}, this.objectCallback);
        }
        else {
          this.setState({loaded:true})
        }
    }

    objectCallback(result) {
      var task = result[0]['task'];
      task['loaded'] = true;
      this.setState(task)
    }

    render() {

				var Components = [TextInput, NumberInput];

			var created_at = {'name': 'created_at', 'label': 'Created_At', 'placeholder': 'Created_At', 'value': false, 'display_time': true};
			var updated_at = {'name': 'updated_at', 'label': 'Updated_At', 'placeholder': 'Updated_At', 'value': false, 'display_time': true};
			var name = {'name': 'name', 'label': 'Name', 'placeholder': 'Name', 'value': ''};
			var expected_pomodoros = {'name': 'expected_pomodoros', 'label': 'Expected_Pomodoros', 'placeholder': 0, 'value': 0};
			var pomodoros = {'name': 'pomodoros', 'label': 'Pomodoros', 'placeholder': 0, 'value': 0};
			var parent_task = {'name': 'parent_task', 'label': 'Parent_Task', 'placeholder': 'Parent_Task', 'value': '', 'optionsUrl': '/api/home/task/', 'optionsUrlMap': {'text':'{task.unicode}','value':'{task.id}'}};
			var user = {'name': 'user', 'label': 'User', 'placeholder': 'User', 'value': '', 'optionsUrl': '/api/user/user/', 'optionsUrlMap': {'text':'{user.unicode}','value':'{user.id}'}};
			var ComponentProps = [name, expected_pomodoros];

        var defaults = this.state;

        var submitUrl = "/api/home/task/";
        if (this.props.task_id) {
          submitUrl += this.props.task_id + '/';
        }

        var deleteUrl = undefined;
        if (this.props.task_id) {
          deleteUrl = "/api/home/task/" + this.props.task_id + "/delete/";
        }


        var title = <Header text={'Create New Task'} size={2} />
        if (this.props.task_id) {
          title = <Header text={'Edit Task: ' + this.state.name} size={2} />
        }


        var content = <div className="container">
                {title}
                <Form components={Components} redirectUrl={"/viewer/"} objectName={'task'} componentProps={ComponentProps} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} />
                <br />
        </div>;

        return (
          <div>
            <Wrapper loaded={this.state.loaded} content={content} />
          </div>
             );
    }
}
export default EditTask;
