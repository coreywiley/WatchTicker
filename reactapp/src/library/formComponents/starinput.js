import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Star extends React.Component {
  constructor(props) {
    super(props);

    this.setFilled = this.setFilled.bind(this);
  }

  setFilled() {
    this.props.setFilled(this.props.filled)
  }

  render() {

    return (
      <i style={{'color':this.props.color}} key={this.props.filled} onMouseEnter={this.setFilled} onClick={this.setFilled} className={"fas " + this.props.size + " " + this.props.icon}></i>
    )
  }
}

class StarInput extends React.Component {
    constructor(props) {
      super(props);
      this.state = {'filled':0}

      this.setFilled = this.setFilled.bind(this);
    }

    setFilled(num) {
      var state = {}
      state[this.props.name] = num;
      this.setState({'filled':num}, this.props.setFormState(state))

    }

    render() {
        var size = 'fa-1x';
        if (this.props.size) {
            size = 'fa-' + this.props.size + 'x';
        }

       var icon = 'fa-star';
       var filled = 0;
       if (this.state.filled) {
         filled = this.state.filled;
       }

       var stars = [];
       for (var i = 0; i < 5; i++) {
         if (i < filled) {
           stars.push(<Star color={'#ffc120'} filled={i+1} setFilled={this.setFilled} size={size} icon={icon} />)
         }
         else {
           stars.push(<Star color={'#ccc'} filled={i+1} setFilled={this.setFilled} size={size} icon={icon} />)
         }
       }


        return (
            <div style={{'display':'inline-block'}}>
              {stars}
            </div>
        );
    }
}

export default StarInput;
