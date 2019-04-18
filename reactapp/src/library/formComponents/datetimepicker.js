import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import Datetime from 'react-datetime';

class DateTimePicker extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

    handleChange(e) {
      var value = '';

      if (this.props.display_time == false) {
        value = e.format("YYYY-M-DD");
      }
      else if (this.props.display_date == false) {
        value = e.format("hh:mm A");
      }
      else {
        value = e.format("M/DD/YYYY hh:mm A");
      }

      var newState = {}
      newState[this.props.name] = value;
      this.props.setFormState(newState);
    }

    render() {

        var layout = '';
        if (this.props.layout) {
            layout = this.props.layout;
        }
        //<input type="text" className="form-control" name={this.props.name} onChange={this.props.handleChange} value={this.props.value} placeholder={this.props.placeholder} />

        var display_time = true;
        console.log("Display Time", this.props.display_time)
        if (this.props.display_time == false) {
          console.log("Display time false!")
          display_time = false;
        }

        var display_date = true;
        if (this.props.display_date == false) {
          display_date = false;
        }

        return (
              <div className={"form-group " + this.props.layout}>
                <label>{this.props.label}</label>
                <Datetime timeFormat={display_time} dateFormat={display_date}  onChange={this.handleChange} defaultValue={this.props.value}/>

              </div>
        )


    }
}

export default DateTimePicker;
