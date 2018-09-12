import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';
import { DateTimePicker } from 'react-widgets';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

Moment.locale('en')
momentLocalizer()

class DateTime extends Component {
    render() {

        var layout = '';
        if (this.props.layout) {
            layout = this.props.layout;
        }
        //<input type="text" className="form-control" name={this.props.name} onChange={this.props.handlechange} value={this.props.value} placeholder={this.props.placeholder} />

        return (
              <div className={"form-group " + this.props.layout}>
                <label>{this.props.label}</label>
                <DateTimePicker />

              </div>
        )


    }
}

export default DateTime;
