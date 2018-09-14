import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Select, ColorPicker, EmojiList, EmojiSlider} from 'library';
import ajaxWrapper from 'base/ajax.js';
import Nav from 'projectLibrary/nav.js';
import Sidebar from 'projectLibrary/sidebar.js';

class EmojiSliderEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            emojiForm: {
              prompt: 'How fast is the emoji slider going to take off?',
              background_color: '#fff',
              progress_bar_color: '#ff0000',
              emoji:'rocket',
              text_color:'#000',
              width: '100%',
              domain: this.props.domain,
            }
        };
        this.setGlobalState = this.setGlobalState.bind(this);
        this.getSliderData = this.getSliderData.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    setGlobalState(name, value) {
      var newState = {}
      newState[name] = value;
      this.setState(newState);
    }

    componentDidMount() {
      if (this.props.slider) {
        ajaxWrapper('GET','/api/home/emojislider/' + this.props.slider + '/', {}, this.getSliderData)
      }
      else {
        this.setState({'loaded':true})
      }
    }

    getSliderData(result) {
      var slider = result[0]['emojislider'];
      var emojiForm = this.state.emojiForm;
      for (var index in slider) {
        emojiForm[index] = slider[index]
      }
      this.setState({loaded:true, emojiForm: emojiForm})
    }

    redirect(result) {
      console.log("Result",result);
      var url = '/sliderDetails/' + this.props.domain + '/' + result[0]['emojislider']['id'] + '/';
      window.location.href = url;
    }

    render() {
      //Example
      //var answerProps = {'name':'response', 'value':''}
      //var defaults = {'response':'', 'question':this.props.question_id, 'sid':this.props.user_id}
      //var submitUrl = '/api/home/answer/';
      //var redirectUrl = '/referenceGuide/' + this.props.question_id + '/';
      var Components = [TextInput, TextInput, Header, ColorPicker, Header, ColorPicker, Header, ColorPicker, EmojiList]
      var promptProps = {'name':'prompt', 'value':this.state.emojiForm.prompt, 'label':'Prompt'}
      var widthProps = {'name':'width', 'value':'100%', 'label':'Width (% or px)'}
      var textColorHeader = {'size':6,'text':'Text Color'};
      var textColorProps = {'name':'text_color', 'value':this.state.emojiForm.textColor, 'disableAlpha':true}
      var backgroundColorHeader = {'size':6,'text':'Background Color'};
      var backgroundColorProps = {'name':'background_color', 'value':this.state.emojiForm.backgroundColor, 'disableAlpha':true}
      var progressBarColorHeader = {'size':6,'text':'Bar Color'};
      var progressBarColorProps = {'name':'progress_bar_color', 'value':this.state.emojiForm.progressBarColor, 'disableAlpha':true}
      var emojiProps = {'name':'emoji', 'value':this.state.emojiForm.emoji}

      var ComponentProps = [promptProps, widthProps, textColorHeader, textColorProps, backgroundColorHeader, backgroundColorProps, progressBarColorHeader, progressBarColorProps, emojiProps];

      var submitUrl = '/api/home/emojislider/'
      if (this.props.slider) {
        submitUrl += this.props.slider + '/'
      }

      var redirectUrl = '/domain/' + this.props.domain + '/';

      var content =<div className="container" style={{'marginTop':'50px'}}>
          <EmojiSlider {...this.state.emojiForm} />
            <div >
              <Form components={Components} submitUrl={submitUrl} redirect={this.redirect} autoSetGlobalState={true} first={true} globalStateName={'emojiForm'} setGlobalState={this.setGlobalState} componentProps={ComponentProps} defaults={this.state.emojiForm} />
            </div>
          </div>

          if (this.props.user_id) {
            return (
                <div>
                  <Nav />
                  <Sidebar domain={this.props.domain} user={this.props.user_id} logOut={this.props.logOut} />
                  <Wrapper loaded={true} content={content} />
                </div>
                 );
          }
          else {
            return (
                <div>
                </div>
            );
          }
    }
}

export default EmojiSliderEditor;
