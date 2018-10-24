
import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput} from 'library';
import Navbar from 'projectLibrary/nav.js';

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {'name':'', 'description':'','order':1, 'price':0, 'loaded':false};

        this.courseCallback = this.courseCallback.bind(this);
    }

    componentDidMount(value) {
      console.log("Form Value",value)
        ajaxWrapper('GET','/api/home/course/' + this.props.course_id + '/', {}, this.courseCallback);
    }

    courseCallback(result) {
      var course = result[0]['course'];
      course['loaded'] = true;
      this.setState(course)
    }

    render() {

        var Components = [TextInput, TextArea, NumberInput, NumberInput];
        var name = {'value':'','name':'name','label':'Name:','placeholder': 'Name'}
        var description = {'value':'','name':'description','label':'Description','placeholder': 'Course Description'}
        var price = {'value':'','name':'price','label':'Price: (Free on signup if 0)','placeholder': 19.99}
        var order = {'value':'','name':'order','label':'Order:','placeholder': 1}


        var ComponentProps = [name, description, price, order];
        var defaults = this.state;

        var submitUrl = "/api/home/course/";
        if (this.props.course_id) {
          submitUrl += this.props.course_id + '/';
        }

        var deleteUrl = undefined;
        if (this.props.course_id) {
          deleteUrl = "/api/home/course/" + this.props.course_id + "/delete/";
        }

        var extra = null;
        if (this.props.course_id) {
          extra = <a href={'/courseVideos/' + this.props.course_id + '/'}>Manage Videos</a>;
        }

        var title = <Header text={'Create New Course'} size={2} />
        if (this.props.course_id) {
          title = <Header text={'Edit Course: ' + this.state.name} size={2} />
        }


        var content = <div className="container">
                {title}
                <Form components={Components} redirectUrl={"/viewCourses/"} componentProps={ComponentProps} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} />
                <br />
                {extra}
        </div>;


        return (
          <div>
            <Wrapper loaded={true} content={content} />
          </div>
             );
    }
}
export default SignUp;
