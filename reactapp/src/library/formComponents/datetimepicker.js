import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import Datetime from 'react-datetime';
import {TextInput, Select} from 'library';

class DateTimePicker extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.config = {
        form_components: [
            <TextInput label={'Name'} name={'name'} />,
            <TextInput label={'redirectUrl'} name={'redirectUrl'} />,
        ],
        can_have_children: true,
    }

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
        if (this.props.display_time == false) {
          display_time = false;
        }

        var display_date = true;
        if (this.props.display_date == false) {
          display_date = false;
        }

        return (
              <div className={"form-group " + this.props.className}>
                <label>{this.props.label}</label>
                <Datetime timeFormat={display_time} dateFormat={display_date}  onChange={this.handleChange} defaultValue={this.props.value}/>

              </div>
        )


    }
}

export default DateTimePicker;
