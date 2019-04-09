
import React, { Component } from 'react';

import {Wrapper} from 'library';
import {ajaxWrapper} from 'functions';
import {Container, Button, Image, Form, TextInput, If, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText} from 'library';
import Alarm from 'projectLibrary/alarm.js';
import PomodoroCard from 'projectLibrary/pomodoroCard.js';


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
