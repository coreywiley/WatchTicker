import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import {Header} from 'library';
import settings from 'base/settings.js';


class Alarm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {seconds: props.seconds}
      this.tick = this.tick.bind(this);
    }

    componentDidMount() {
      this.interval = setInterval(() => this.tick(), 1000);
    }

    tick() {
      var seconds = this.state.seconds;
      if (seconds == 0) {
        console.log("Alarm Ending")
        clearInterval(this.interval);
        var sound = new Audio(this.props.audioUrl);
        sound.volume = 1;
        sound.play();

        var newState = {}
        newState[this.props.name] = false;

        this.props.setGlobalState(this.props.name, newState)

      }
      else {
        this.setState({seconds: seconds - 1})
      }
    }

    render() {
      var time_string = this.state.seconds;
      var minutes = Math.floor(this.state.seconds/60);
      var seconds = this.state.seconds % 60;
      if (seconds < 10) {
        seconds = '0' + seconds;
      }

      return (
        <div className="container">
            <Header size={2} text={'Pomodoro'} />
            <Header size={1} text={minutes + ':' + seconds} />
        </div>
      )
    }
}


export default Alarm;
