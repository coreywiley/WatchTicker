
import React, { Component } from 'react';

import {Wrapper} from 'library';
import {ajaxWrapper} from 'functions';
import {Container, Button, Image, TextInput, Navbar, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {'created_at' : '', 'updated_at' : '', 'name' : '', 'expected_pomodoros' : 'false', 'pomodoros' : 'false', 'parent_task' : '', 'user' : ''}

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/task/' + this.props.task_id + '/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var task = result[0]['task'];
      task['loaded'] = true;
      this.setState(task)
    }

    render() {

			var created_at = {'text': this.state.created_at};
			var updated_at = {'text': this.state.updated_at};
			var name = {'text': this.state.name};
			var expected_pomodoros = {'text': this.state.expected_pomodoros};
			var pomodoros = {'text': this.state.pomodoros};
			var parent_task = {'text': this.state.parent_task};
			var user = {'text': this.state.user};
			var ComponentProps = [created_at, updated_at, name, expected_pomodoros, pomodoros, parent_task, user];


      var content =
        <div className="container">
          <Header size={1} text={this.state.name} />
						<Paragraph {...ComponentProps[0]} />
						<Paragraph {...ComponentProps[1]} />
						<Paragraph {...ComponentProps[2]} />
						<Paragraph {...ComponentProps[3]} />
						<Paragraph {...ComponentProps[4]} />
						<Paragraph {...ComponentProps[5]} />
						<Paragraph {...ComponentProps[6]} />

        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Task;
