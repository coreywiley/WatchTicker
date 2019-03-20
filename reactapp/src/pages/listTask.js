
import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';
import Alarm from 'projectLibrary/alarm.js';

class ExperimentalButton extends Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  }

  click() {
      for (var index in this.props.onClick) {
        this.props.onClick[index]();
      }
  }

  render() {
    return (
      <Button type={this.props.type} text={this.props.text} onClick={this.click} />
    )
  }
}

class Complete extends Component {
  constructor(props) {
    super(props);
    this.complete = this.complete.bind(this);
    this.startPomodoro = this.startPomodoro.bind(this);
  }

  complete() {
    //ajaxWrapper('POST','/api/home/task/' + this.props.task_id + '/', {'completed':true}, console.log)
    this.props.refresh()
  }

  startPomodoro() {
    this.props.setGlobalState('start', {pomodoro:true})
    //ajaxWrapper('POST','/api/home/pomodoro/', {'task':this.props.task.id}, console.log)
    //ajaxWrapper('POST','/api/home/task/' + this.props.task.id + '/', {'pomodoros':this.props.task.pomodoros + 1}, this.props.start)
  }

  render() {
    return (
      <div>
      <ExperimentalButton type={'primary'} text={'Start Pomodoro'} onClick={[() => console.log("Success"), () => this.props.setGlobalState('start', {pomodoro:true})]} />
      <ExperimentalButton type={'success'} text={'Complete'} onClick={[this.props.refresh]} />
      </div>
    )
  }
}



class Icons extends Component {
  render() {

    var images = [];
    for (var i = 0; i < this.props.num_icons; i++) {
      images.push(this.props.icon)
    }

    return (
      <div>
        {images}
      </div>
    )
  }
}

class PomodoroCard extends Component {
  render () {
      var buttons = [<Complete task_id={this.props.id} refresh={this.props.refresh} setGlobalState={this.props.setGlobalState} />]

      return (
        <Card name={this.props.name}
        description={
            <Icons num_icons={this.props.icons}
            icon={<img src='https://cdn4.iconfinder.com/data/icons/food-drink-14/24/Tomato-512.png' style={{width:'40px'}} />} />
          }
          buttons={buttons}
        />
      )
  }

}

class If extends Component {
  render() {
    if (this.props.logic) {
      return (this.props.children)
    }
    else {
      return (null);
    }

  }
}

class TaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {pomodoro:false, completed: false, loaded:true}

        this.setGlobalState = this.setGlobalState.bind(this);
    }

    setGlobalState(name, state) {
      this.setState(state)
    }

    render() {

      //<Button type={'info'} text={text} onClick={() => this.setState({completed: !this.state.completed})} />

      var content =
      <div className="container">
        <If logic={this.state.pomodoro == false} >
            <Header size={2} text={'Tasks'} />
            <br />
            <Button type={'success'} text={'Add New Task'} href={'/editTask/'} />
            <br />
            <List
              setGlobalState={this.setGlobalState}
              dataUrl={'/api/home/task/?completed=False&user=' + this.props.user.id}
              dataMapping={{name:'{name}', icons:'{pomodoros}', id:'{id}'}}
              component={PomodoroCard}
              objectName={'task'}
              />
        </If>
        <If logic={this.state.pomodoro}>
          <Alarm audioUrl={"/static/Pomodoro_Over.m4a"} seconds={25*60} name={'pomodoro'} setGlobalState={this.setGlobalState} />
        </If>
        </div>



        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default TaskList;
