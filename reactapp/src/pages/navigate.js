import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker, Checkbox} from 'library';

class Navigate extends Component {

    render() {

        var content = <div className="container">
                <Header size={3} text={'Where to?'} />
                <p><a href="/questionList/">On Boarding Questions</a></p>
                <p><a href="/notifications/">Notifications</a></p>
                <p><a href="/faqList/">FAQs</a></p>
                  <br />
        </div>;

        return (
          <div>
            <Wrapper loaded={true} content={content} />
          </div>
             );
    }
}
export default Navigate;
