
import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker, Small} from 'library';

class ThankYou extends Component {

    render() {

        var content = <div className="container">
                <Header size={1} text={'Thank You'} />
        </div>;

        return (
          <div>
            <Wrapper loaded={true} content={content} />
          </div>
             );
    }
}
export default ThankYou;
