import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, TextArea, Link, Button, Alert, MultiLineText, PageBreak, StarInput} from 'library';


class ReviewForm extends Component {
  constructor(props) {
    super(props);
    this.state = {'rating':'','feedback':'', 'business':this.props.business, 'user':this.props.user};
  }


    render() {
        var Components = [StarInput, TextArea];
        var feedback = {'value':'','name':'feedback','label':'Feedback','placeholder': 'Such a fun place to hang out! We will be coming back.'}
        var rating = {'value':0, 'name':'rating', 'label':'Rating'}

        var ComponentProps = [rating, feedback];
        var defaults = this.state;

        var title = <h2>Leave A Review</h2>
        var submitUrl = "/api/home/review/";

        var content = <div className="container">
                {title}
                <Form components={Components} refreshData={this.props.refreshData} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} objectName={'review'} submitButtonType={'patron'} />
        </div>;


        return (
            <Wrapper loaded={true} content={content} />
             );
    }
}

export default ReviewForm;
