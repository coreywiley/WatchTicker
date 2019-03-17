
import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';

class Complete extends Component {
  constructor(props) {
    super(props);
    this.complete = this.complete.bind(this);
    this.startPomodoro = this.startPomodoro.bind(this);
  }

  complete() {
    ajaxWrapper('POST','/api/home/task/' + this.props.task.id + '/', {'completed':true}, this.props.refresh)
  }

  startPomodoro() {
    ajaxWrapper('POST','/api/home/pomodoro/', {'task':this.props.task.id}, console.log)
    ajaxWrapper('POST','/api/home/task/' + this.props.task.id + '/', {'pomodoros':this.props.task.pomodoros + 1}, this.props.start)
  }

  render() {
    return (
      <div>
      <Button type={'primary'} text={'Start Pomodoro'} onClick={this.startPomodoro} />
      <Button type={'success'} text={'Complete'} onClick={this.complete} />
      </div>
    )
  }
}

class TaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {'tasks':[], pomodoro:false, completed: false}

        this.objectCallback = this.objectCallback.bind(this);
        this.startPomodoro = this.startPomodoro.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
      this.refresh();
    }

    refresh() {
      console.log("Refreshing");
      ajaxWrapper('GET','/api/home/task/?user=' + this.props.user.id, {}, this.objectCallback);
    }

    startPomodoro() {
      this.setState({pomodoro:true, seconds:25*60})
      this.interval = setInterval(() => this.tick(), 1000);
    }

    tick() {
      var seconds = this.state.seconds;
      if (seconds == 0) {
        clearInterval(this.interval);
        var sound = new Audio("/static/Pomodoro_Over.m4a");
        sound.volume = 1;
        sound.play();

        this.setState({pomodoro:false}, this.refresh)

      }
      else {
        this.setState({seconds: seconds - 1})
      }
    }

    objectCallback(result) {
      console.log("Callback")
      var tasks = []
      for (var index in result) {
        var task = result[index]['task'];
        tasks.push(task)
      }
      this.setState({'tasks':tasks, 'loaded':true})
    }

    render() {
      console.log("Here");

      var tasks = [];
      for (var index in this.state.tasks) {
        var task = this.state.tasks[index];
        if (task['completed'] == this.state.completed) {
          var buttons = [<Complete task={task} refresh={this.refresh} start={this.startPomodoro} />]
          var description = [];
          for (var i = 0; i < task['pomodoros']; i++) {
            description.push(<img src='https://cdn4.iconfinder.com/data/icons/food-drink-14/24/Tomato-512.png' style={{width:'40px'}} />)
          }
          tasks.push(<Card name={task.name} description={description} button_type={'primary'} buttons={buttons} />)
        }
      }

      if (this.state.pomodoro) {
        var time_string = this.state.seconds;
        var minutes = Math.floor(this.state.seconds/60);
        var seconds = this.state.seconds % 60;
        if (seconds < 10) {
          seconds = '0' + seconds;
        }

        var content = <div className="container">
            <Header size={2} text={'Pomodoro'} />
            <Header size={1} text={minutes + ':' + seconds} />
        </div>
      }
      else {

        if (this.state.completed) {
          var text ='See In-Complete Tasks';
        }
        else {
          var text = 'See Complete Tasks';
        }

      var content =
        <div className="container">
          <Header size={2} text={'Tasks'} />
          <br />
          <Button type={'success'} text={'Add New Task'} href={'/editTask/'} />
          <Button type={'info'} text={text} onClick={() => this.setState({completed: !this.state.completed})} />
          <br />
          {tasks}
        </div>;
      }

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default TaskList;
