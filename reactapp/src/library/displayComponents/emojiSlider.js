import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Select, ColorPicker, EmojiList} from 'library';

import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time

class EmojiSlider extends Component {
    constructor(props) {
      super(props);
      this.state = {'total_width':0, width:0, 'bubble':this.props.live}



      this.handleStart = this.handleStart.bind(this);
      this.handleDrag = this.handleDrag.bind(this);
      this.handleStop = this.handleStop.bind(this);
    }

    componentDidMount() {
      var width = document.getElementById('progress').getBoundingClientRect().width;
      console.log("Total Width",width)
      this.setState({'total_width':width})
    }

    handleStart() {
      if (this.props.handleStart) {
        this.props.handleStart();
      }
    }

    handleDrag(e, data) {
      console.log("Dragging!!", data);
      var width = Math.floor((data.x+50)/this.state.total_width*100);
      this.setState({'width':width})
    }

    handleStop() {
      if (this.props.handleStop) {
        this.props.handleStop(this.state.width);
      }
    }

    render() {


      var progressBarStyle = {"width": this.state.width + "%", 'backgroundColor': this.props.progress_bar_color}
      var draggableStyle = {
        width: "0px",
        height: "0px",
        cursor: "move",
        fontSize:"40px",
      }

        var emojiIcon = <div>
        <Draggable axis="x" onStart={this.handleStart} onDrag={this.handleDrag} onStop={this.handleStop} bounds={{left:-50, right:this.state.total_width - 50}} defaultPosition={{x:-50,y:0}} >
          <div className={this.props.emoji} style={draggableStyle}></div>
          </Draggable></div>;
        if (this.props.live == false) {
          var emojiIcon = <Draggable axis="none" bounds={{left:-50, right:this.state.total_width - 50}} defaultPosition={{x:-50 + this.state.total_width*this.props.width/100,y:0}} >

            <div className={this.props.emoji} style={draggableStyle}></div>
            </Draggable>;
          progressBarStyle = {"width": this.props.width + "%", 'backgroundColor': this.props.progress_bar_color}
        }

        return (
          <div style={{"padding":"50px", "backgroundColor": this.props.background_color}}>
            <h2 style={{"textAlign":'center', 'color':this.props.text_color}}>{this.props.prompt}</h2>
            <p style={{"textAlign":'center', 'color':this.props.text_color}}>Drag the emoji to vote!</p>
            <div id="container" style={{"paddingRight": "25px", "paddingLeft":"25px", "zIndex":"99999"}}>
            {emojiIcon}
            </div>
            <div className="labels">
              <span style={{"height":"25px"}}></span>
            </div>
            <div id='progress' className="progress">
              <div className="progress-bar" role="progressbar" style={progressBarStyle}>
              </div>
            </div>
          </div>
        );
    }
}

export default EmojiSlider;
