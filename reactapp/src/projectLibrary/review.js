import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, TextArea, Link, Button, Alert, MultiLineText, PageBreak, Stars} from 'library';


class Review extends Component {
  render() {

      var content =
              <div>
              <p style={{'margin-bottom':'5px', 'fontWeight':'bold'}}>{this.props.user.first_name} {this.props.user.last_name.substring(0,1)}.</p>
              <Stars filled={this.props.rating} />
              <MultiLineText text={this.props.feedback} />
              </div>;

      return (
          <Wrapper loaded={true} content={content} />
           );
  }
}

export default Review;
