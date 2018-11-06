
import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker, Small} from 'library';

class EditEvent extends Component {
    constructor(props) {
        super(props);

        this.state = {'host' : this.props.user.id, 'name' : '', 'description' : '', 'length' : '30','event_type':'', 'holidays' : 'false'};

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount(value) {
        ajaxWrapper('GET','/api/home/event/' + this.props.event_id + '/', {}, this.objectCallback);
    }

    objectCallback(result) {
      var event = result[0]['event'];
      event['loaded'] = true;
      this.setState(event)
    }

    render() {

			var steps = [];

      steps.push(<a>1. Fill Out Your Availability</a>)

      if (this.state.event_type == 'Book Me') {
        steps.push(<a>2. Publish Your Event Link</a>)
      }
      else {
        steps.push(<a>2. Invite Your Friends and Co-Workers</a>)
      }


        var content = <div className="container">
                {steps}
        </div>;

        return (
          <div>
            <Wrapper loaded={this.state.loaded} content={content} />
          </div>
             );
    }
}
export default EditEvent;
