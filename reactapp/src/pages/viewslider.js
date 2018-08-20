import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Select, ColorPicker, EmojiList, EmojiSlider} from 'library';
import ajaxWrapper from 'base/ajax.js';


class EmojiSliderViewer extends Component {
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
              width:'100%',
              domain: this.props.domain,
            },
            interacted: false,
        };
        this.getSliderData = this.getSliderData.bind(this);
        this.sliderStop = this.sliderStop.bind(this);
        this.sliderStart = this.sliderStart.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/emojislider/' + this.props.slider + '/', {}, this.getSliderData)
    }

    getSliderData(result) {
      var slider = result[0]['emojislider'];
      var emojiForm = this.state.emojiForm;
      for (var index in slider) {
        emojiForm[index] = slider[index]
      }
      this.setState({loaded:true, emojiForm: emojiForm}, () => ajaxWrapper('POST','/api/home/sliderimpressions/', {'emoji_slider':this.props.slider, 'ip':window.CLIENT_IP}, console.log))
    }

    sliderStart() {
      ajaxWrapper('POST','/api/home/slideranswers/', {'emoji_slider':this.props.slider, 'ip':window.CLIENT_IP, value: -1}, console.log)
    }

    sliderStop(width) {
      ajaxWrapper('POST','/api/home/slideranswers/', {'emoji_slider':this.props.slider, 'ip':window.CLIENT_IP, value:width}, console.log)
      try {
          window.parent.fbq('trackCustom',this.state.emojiForm.prompt, {'value':width})
      }
      catch(err) {
          console.log(err.message);
      }
      try {
          window.parent.dataLayer.push({'event':this.state.emojiForm.prompt,'conversionValue':width});
      }
      catch(err) {
          console.log(err.message);
      }
      try {
        window.parent.gtag('event', 'Emoji Slide', {
          'event_category': 'Emoji Slider',
          'event_label': this.state.emojiForm.prompt,
          'value': width
        });
      }
      catch(err) {
          console.log(err.message);
      }

    }

    render() {

      var content = <EmojiSlider {...this.state.emojiForm} handleStart={this.sliderStart} handleStop={this.sliderStop} />;
        return (
          <div>
              <Wrapper content={content} loaded={this.state.loaded} />
          </div>

        );
    }
}

export default EmojiSliderViewer;
