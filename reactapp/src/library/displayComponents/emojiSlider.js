import React, { Component } from 'react';
import {Wrapper} from 'library';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Select, ColorPicker, EmojiList} from 'library';

import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time

class EmojiSlider extends Component {
    constructor(props) {
      super(props);
      this.state = {'total_width':0, width:0, 'bubble':this.props.live, 'hidden':'', 'chatText':'Slide To Answer', 'animate':true, 'increase':true, 'wait':false, 'wait_time':0, 'submitted':false}



      this.handleStart = this.handleStart.bind(this);
      this.handleDrag = this.handleDrag.bind(this);
      this.handleStop = this.handleStop.bind(this);
      this.animate = this.animate.bind(this);
    }

    animate() {
      if (this.state.animate == true) {
        if (this.state.wait == false) {
          if (this.state.increase == true) {
            var add = .25;
          }
          else {
            var add = -.25;
          }
          console.log("This.state.width", this.state.width)
          var newState = {'width': this.state.width + add}
          if (this.state.width > 5) {
            newState['increase'] = false;
          }
          else if (this.state.width < .5) {
            newState['increase'] = true;
            if (this.state.increase == false) {
              newState['wait'] = true;
            }
            }
         }
        else {
          if (this.state.wait_time < 300) {
          this.setState({'wait_time': this.state.wait_time + 1})
        }
        else {
          this.setState({'wait_time':0, 'wait':false})
        }

        }

        this.setState(newState)
      }
    }

    updateDimensions() {
      var width = document.getElementById('progress').getBoundingClientRect().width;
      this.setState({'total_width':width})
    }

    componentDidMount() {
      var width = document.getElementById('progress').getBoundingClientRect().width;
      this.setState({'total_width':width})
      this.interval = setInterval(() => this.animate(), 20);
      window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    handleStart() {
      if (this.props.handleStart) {
        this.props.handleStart();
      }
      this.setState({'hidden': 'hidden', 'animate':false})
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
      this.setState({'hidden': '', 'chatText':'Awesome!', 'submitted':true})

    }

    render() {


      var progressBarStyle = {"width": this.state.width + "%", 'backgroundColor': this.props.progress_bar_color}
      var draggableStyle = {
        width: "0px",
        height: "0px",
        cursor: "move",
        fontSize:"40px",
      }

        var classCss = 'bubble you';
        if (this.state.width > 50) {
          classCss = 'bubble right';
        }

        var axis = "x";


        var emojiIcon = <div>
        <Draggable axis={axis} disabled={this.state.submitted} onStart={this.handleStart} onDrag={this.handleDrag} onStop={this.handleStop} bounds={{left:-50, right:this.state.total_width - 50}} defaultPosition={{x:-50,y:0}} >
          <div className={this.props.emoji} style={draggableStyle}><div className={"chat " + this.state.hidden}>
            <div className={classCss}>{this.state.chatText}</div>
          </div></div>
          </Draggable></div>;
        if (this.state.animate == true) {
          var position = {x: Math.floor(this.state.width*this.state.total_width/100) - 50,y:0}
          var emojiIcon = <div>
          <Draggable axis={axis} disabled={this.state.submitted} onStart={this.handleStart} onDrag={this.handleDrag} onStop={this.handleStop} bounds={{left:-50, right:this.state.total_width - 50}} defaultPosition={position} position={position}>
            <div className={this.props.emoji} style={draggableStyle} position={position}><div className={"chat " + this.state.hidden}>
              <div className={classCss}>{this.state.chatText}</div>
            </div></div>
            </Draggable></div>;
        }
        else if (this.state.submitted == true) {
          var position = {x: Math.floor(this.state.width*this.state.total_width/100) - 50,y:0}
          var emojiIcon = <div>
          <Draggable axis={axis} disabled={this.state.submitted} onStart={this.handleStart} onDrag={this.handleDrag} onStop={this.handleStop} bounds={{left:-50, right:this.state.total_width - 50}} defaultPosition={position} position={position}>
            <div className={this.props.emoji} style={draggableStyle} position={position}><div className={"chat " + this.state.hidden}>
              <div className={classCss}>{this.state.chatText}</div>
            </div></div>
            </Draggable></div>;
        }
        if (this.props.live == false) {
          var emojiIcon = <Draggable axis="none" bounds={{left:-50, right:this.state.total_width - 50}} defaultPosition={{x:-50 + this.state.total_width*this.props.width/100,y:0}} >

            <div className={this.props.emoji} style={draggableStyle}><div className={"chat " + this.state.hidden}>
              <div className={classCss}>{this.state.chatText}</div>
            </div></div>
            </Draggable>;
          progressBarStyle = {"width": this.props.width + "%", 'backgroundColor': this.props.progress_bar_color}
        }

        return (
          <div style={{"padding":"50px", "backgroundColor": this.props.background_color}}>
            <h2 style={{"textAlign":'center', 'color':this.props.text_color}}>{this.props.prompt}</h2>

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
