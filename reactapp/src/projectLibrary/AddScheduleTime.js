
import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker, Button, Checkbox} from 'library';

class AddScheduleTime extends Component {
    constructor(props) {
        super(props);

        this.state = {'recurring':false, 'choice':'start_time', 'start_time' : '', 'end_time' : '', 'available' : true, 'repeat_monday' : false, 'repeat_tuesday' : false, 'repeat_wednesday' : false, 'repeat_thursday' : false, 'repeat_friday' : false, 'repeat_saturday' : false, 'repeat_sunday' : false, 'user' : '', 'event' : ''};

        this.objectCallback = this.objectCallback.bind(this);
        this.chooseStartTime = this.chooseStartTime.bind(this);
        this.chooseEndTime = this.chooseEndTime.bind(this);
        this.chooseRecurringTime = this.chooseRecurringTime.bind(this);
        this.chooseOneTime = this.chooseOneTime.bind(this);
        this.repeat_monday = this.repeat_monday.bind(this);
        this.repeat_tuesday = this.repeat_tuesday.bind(this);
        this.repeat_wednesday = this.repeat_wednesday.bind(this);
        this.repeat_thursday = this.repeat_thursday.bind(this);
        this.repeat_friday = this.repeat_friday.bind(this);
        this.repeat_saturday = this.repeat_saturday.bind(this);
        this.repeat_sunday = this.repeat_sunday.bind(this);
    }

    componentDidMount(value) {
        if(this.props.scheduletime_id) {
          ajaxWrapper('GET','/api/home/scheduletime/' + this.props.scheduletime_id + '/', {}, this.objectCallback);
        }
        else {
          this.setState({loaded:true})
        }
    }

    objectCallback(result) {
      var scheduletime = result[0]['scheduletime'];
      scheduletime['loaded'] = true;
      this.setState(scheduletime)
    }

    chooseStartTime() {
      this.props.toggleCalendar('start_time', this.state.recurring);
    }

    chooseEndTime() {
      this.props.toggleCalendar('end_time', this.state.recurring);
    }

    chooseRecurringTime() {
      this.setState({'recurring':true})
    }

    chooseOneTime() {
      this.setState({'recurring':false})
    }


    repeat_monday() {
      this.setState({'repeat_monday':!this.state.repeat_monday})
    }
    repeat_tuesday() {
      this.setState({'repeat_tuesday':!this.state.repeat_tuesday})
    }
    repeat_wednesday() {
      this.setState({'repeat_wednesday':!this.state.repeat_wednesday})
    }
    repeat_thursday() {
      this.setState({'repeat_thursday':!this.state.repeat_thursday})
    }
    repeat_friday() {
      this.setState({'repeat_friday':!this.state.repeat_friday})
    }
    repeat_saturday() {
      this.setState({'repeat_saturday':!this.state.repeat_saturday})
    }
    repeat_sunday() {
      this.setState({'repeat_sunday':!this.state.repeat_sunday})
    }

    render() {


			var available = {'name': 'available', 'value': this.state.available, 'layout':'form-inline', 'options': [{'value':true,'text':'available'},{'value':false,'text':'un-available'}]};

      var recurringType = 'outline-primary';
      var oneTimeType = 'primary';
      var start_time_text = this.props.start_time;
      var end_time_text = this.props.end_time;
      if (this.state.recurring) {
        recurringType = 'primary';
        oneTimeType = 'outline-primary'

        if (start_time_text != 'Click To Choose') {
          start_time_text = this.props.start_time.split(" ")[1]
        }
        if (end_time_text != 'Click To Choose') {
          end_time_text = this.props.end_time.split(" ")[1]
        }
      }

			var repeat_monday = {'name': 'repeat_monday', 'label': 'Monday', 'value': 'repeat_monday', 'checked': this.state.repeat_monday, 'onChange':this.repeat_monday, 'style':{'display':'inline-block','paddingRight':'10px'}};
			var repeat_tuesday = {'name': 'repeat_tuesday', 'label': 'Tuesday', 'value': 'repeat_tuesday', 'checked': this.state.repeat_tuesday, 'onChange':this.repeat_tuesday, 'style':{'display':'inline-block','paddingRight':'10px'}};
      var repeat_wednesday = {'name': 'repeat_wednesday', 'label': 'Wednesday', 'value': 'repeat_wednesday', 'checked': this.state.repeat_wednesday, 'onChange':this.repeat_wednesday, 'style':{'display':'inline-block','paddingRight':'10px'}};
      var repeat_thursday = {'name': 'repeat_thursday', 'label': 'Thursday', 'value': 'repeat_thursday', 'checked': this.state.repeat_thursday, 'onChange':this.repeat_thursday, 'style':{'display':'inline-block','paddingRight':'10px'}};
      var repeat_friday = {'name': 'repeat_friday', 'label': 'Friday', 'value': 'repeat_friday', 'checked': this.state.repeat_friday, 'onChange':this.repeat_friday, 'style':{'display':'inline-block','paddingRight':'10px'}};
      var repeat_saturday = {'name': 'repeat_saturday', 'label': 'Saturday', 'value': 'repeat_saturday', 'checked': this.state.repeat_saturday, 'onChange':this.repeat_saturday, 'style':{'display':'inline-block','paddingRight':'10px'}};
      var repeat_sunday = {'name': 'repeat_sunday', 'label': 'Sunday', 'value': 'repeat_sunday', 'checked': this.state.repeat_sunday, 'onChange':this.repeat_sunday, 'style':{'display':'inline-block','paddingRight':'10px'}};

        var defaults = this.state;

        var submitUrl = "/api/home/scheduletime/";
        if (this.props.scheduletime_id) {
          submitUrl += this.props.scheduletime_id + '/';
        }

        var recurringCheck = [];
        if (this.state.recurring) {
          recurringCheck.push(<p>Every</p>)
          recurringCheck.push(<Checkbox {...repeat_monday} />)
          recurringCheck.push(<Checkbox {...repeat_tuesday} />)
          recurringCheck.push(<Checkbox {...repeat_wednesday} />)
          recurringCheck.push(<Checkbox {...repeat_thursday} />)
          recurringCheck.push(<Checkbox {...repeat_friday} />)
          recurringCheck.push(<Checkbox {...repeat_saturday} />)
          recurringCheck.push(<Checkbox {...repeat_sunday} />)
        }

        return (
          <div>
            <Button text={'Recurring'} type={recurringType} clickHandler={this.chooseRecurringTime} />
            <Button text={'One-Time'} type={oneTimeType} clickHandler={this.chooseOneTime} />
            <p>I'm <div style={{'display':'inline-block'}}><Select {...available} /></div> between <Button text={start_time_text} type={'outline-primary'} clickHandler={this.chooseStartTime} /> and <Button text={end_time_text} type={'outline-primary'} clickHandler={this.chooseEndTime} /></p>
            {recurringCheck}
          </div>
             );
    }
}
export default AddScheduleTime;
