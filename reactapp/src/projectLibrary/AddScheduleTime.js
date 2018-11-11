
import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker, Button, Checkbox} from 'library';
import TimeSelect from 'projectLibrary/timeSelect.js';

class AddScheduleTime extends Component {
    constructor(props) {
        super(props);

        if (this.props.id) {
          var repeat_days = ['repeat_sunday','repeat_monday','repeat_tuesday','repeat_wednesday','repeat_thursday','repeat_friday','repeat_saturday']
          var newState = JSON.parse(JSON.stringify(this.props));
          newState['show_calendar'] = false;
          newState['choice'] = 'start_time'

          var recurring = false;
          for (var index in repeat_days) {
            if (this.props[repeat_days[index]] == true) {
              recurring = true;
            }
          }
          newState['recurring'] = recurring

          this.state = newState;
        }
        else {
          this.state = {'show_calendar':false, 'recurring':false, 'choice':'start_time', 'start_time' : 'Click To Choose', 'end_time' : 'Click To Choose', 'available' : false, 'repeat_monday' : false, 'repeat_tuesday' : false, 'repeat_wednesday' : false, 'repeat_thursday' : false, 'repeat_friday' : false, 'repeat_saturday' : false, 'repeat_sunday' : false, 'user' : this.props.user_id, 'event' : this.props.event_id};
        }

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
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.chooseAvailability = this.chooseAvailability.bind(this);
        this.changeAvailabilityState = this.changeAvailabilityState.bind(this);
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
      this.setState({'choosing':'start_time', 'show_calendar':true});
    }

    chooseEndTime() {
      this.setState({'choosing':'end_time', 'show_calendar':true});
    }

    chooseAvailability(value) {
      var newState = {}
      newState[this.state.choosing] = value;
      newState['show_calendar'] = false;
      this.setState(newState);
    }

    chooseRecurringTime() {
      this.setState({'recurring':true})
    }

    chooseOneTime() {
      this.setState({'recurring':false})
    }

    changeAvailabilityState(newState) {
      this.setState(newState)
    }

    save() {
      var data = this.state;
      if (this.props.id) {
        ajaxWrapper('POST', '/api/home/scheduletime/' + this.props.id + '/',data, this.props.refreshData)
      }
      else {
        ajaxWrapper('POST', '/api/home/scheduletime/',data, this.props.refreshData)
      }
    }

    delete() {
      ajaxWrapper('POST', '/api/home/scheduletime/' + this.props.id + '/delete/',{}, this.props.refreshData)
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


			var available = {'name': 'available', 'defaultoption':false, 'setFormState': this.changeAvailabilityState,'value': this.state.available, 'layout':'form-inline', 'options': [{'value':true,'text':'available'},{'value':false,'text':'un-available'}]};

      var recurringType = 'outline-primary';
      var oneTimeType = 'primary';
      var start_time_text = this.state.start_time;
      var end_time_text = this.state.end_time;
      if (this.state.recurring) {
        recurringType = 'primary';
        oneTimeType = 'outline-primary'

        if (start_time_text != 'Click To Choose') {
          if (this.state.start_time.split(" ")[1]) {
            start_time_text = this.state.start_time.split(" ")[1]
          }
          else {
            start_time_text = this.state.start_time.split("T")[1]
          }

        }
        if (end_time_text != 'Click To Choose') {
          if (this.state.end_time.split(" ")[1]) {
            end_time_text = this.state.end_time.split(" ")[1]
          }
          else {
            end_time_text = this.state.end_time.split("T")[1]
          }
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
          recurringCheck.push(<p style={{'margin':'0px'}}>Every</p>)
          recurringCheck.push(<Checkbox {...repeat_monday} />)
          recurringCheck.push(<Checkbox {...repeat_tuesday} />)
          recurringCheck.push(<Checkbox {...repeat_wednesday} />)
          recurringCheck.push(<Checkbox {...repeat_thursday} />)
          recurringCheck.push(<Checkbox {...repeat_friday} />)
          recurringCheck.push(<Checkbox {...repeat_saturday} />)
          recurringCheck.push(<Checkbox {...repeat_sunday} />)
          recurringCheck.push(<br />)
        }

        var buttons = [];
        buttons.push(<Button type={'outline-success'} text={'Save'} clickHandler={this.save} />)
        if (this.props.id) {
          buttons.push(<Button type={'outline-danger'} text={'Delete'} deleteType={true} clickHandler={this.delete} />)
        }

        var calendar = null;
        if (this.state.show_calendar) {
          calendar = <TimeSelect recurring={this.state.recurring} chooseAvailability={this.chooseAvailability} scheduleTimes={this.props.scheduleTimes} />
        }

        return (
          <div>
            <Button text={'Recurring'} type={recurringType} clickHandler={this.chooseRecurringTime} />
            <Button text={'One-Time'} type={oneTimeType} clickHandler={this.chooseOneTime} />
            <p>I'm <div style={{'display':'inline-block'}}><Select {...available} /></div> between <Button text={start_time_text} type={'outline-primary'} clickHandler={this.chooseStartTime} /> and <Button text={end_time_text} type={'outline-primary'} clickHandler={this.chooseEndTime} /></p>
            {recurringCheck}
            {buttons}
            <br />
            {calendar}
          </div>
             );
    }
}
export default AddScheduleTime;
