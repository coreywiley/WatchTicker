import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import {Header, Button, Card, NumberInput, TextInput, CSSInput} from 'library';
import settings from 'base/settings.js';

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
    ajaxWrapper('POST','/api/home/task/' + this.props.task_id + '/', {'completed':true}, console.log)
    this.props.refresh()
  }

  startPomodoro() {
    //this.props.setGlobalState('start', {pomodoro:true})
    ajaxWrapper('POST','/api/home/pomodoro/', {'task':this.props.task_id}, console.log)
    ajaxWrapper('POST','/api/home/task/' + this.props.task_id + '/', {'pomodoros':this.props.task_pomodoros + 1}, () => window.location = '/alarm/')
  }

  render() {
    return (
      <div>
      <ExperimentalButton type={'primary'} text={'Start Pomodoro'} onClick={[this.startPomodoro]} />
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
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <NumberInput label={'order'} name={'order'} />,
                <TextInput label={'id'} name={'id'} />,
                <TextInput label={'name'} name={'name'} />,
                <NumberInput label={'icons'} name={'icons'} />,
                <CSSInput label={'css'} name={'style'} default={{}} />,
            ],
        }
    }

    render () {
        var buttons = [<Complete task_id={this.props.id} task_pomodoros={this.props.pomodoros} />];

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


export default PomodoroCard;
