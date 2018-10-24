
import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card} from 'library';

class Course extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            name: '',
            description: '',
            price: '',
            videos: [],
            bought: false,
        };

        this.courseCallback = this.courseCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper("GET",'/api/home/course/' + this.props.course_id + '/?related=videos',{}, this.courseCallback)
      if (this.props.user_id) {
        ajaxWrapper('GET', '/api/user/user/' + this.props.user_id + '/?related=course', {}, this.userCallback)
      }
    }

    courseCallback(result) {
      var course = result[0]['course']
      course['loaded'] = true;
      this.setState(course)
    }

    userCallback(result) {
      var user = result[0]['user'];
      var bought = false;
      for (var index in user['courses']) {
          if (user['courses'][index]['id'] == parseInt(this.props.course_id)) {
            bought = true;
          }
      }
      this.setState({'bought':bought})
    }



    render() {

      var videos = [];
      for (var index in this.state.videos) {
        var video = this.state.videos[index]['video'];
        console.log("Video", video)
        videos.push(<Card cssClass={'col-md-4'} imageUrl={video['image']} name={video['name']} button_type={'primary'} button={'View'} link={'/video/' + video['id'] + '/'} />)
      }

      var bought = null;
      if (this.props.user_id == "") {
        if (this.state.price > 0) {
          bought = <a href={'/signUp/'}>Sign Up and Purchase the course here for ${this.state.price}</a>
        }
        else {
          bought = <a href={'/signUp/'}>Sign Up To Access This Course For Free</a>
        }
      }
      else if (this.state.price > 0) {
        bought = <a href={'/purchase/' + this.state.id + '/'}>Purchase the course here for ${this.state.price}</a>
      }


      var addVideo = null;
      if (this.props.user && this.props.user.is_staff == true) {
        addVideo = <Button href={'/editVideo/'} button_type={'success'} text={'Add New Video'} />
      }

      var edit = null;
      if (this.props.user.is_staff == true) {
        edit = <Button href={'/editCourse/' + this.state.id + '/'} type={'primary'} text={'Edit Course'} />
      }

      var content =
        <div className="container">
        <div>
          <Header size={1} text={this.state.name} />
          {edit}
          <p>{this.state.description}</p>
          {bought}
          <Header size={3} text={'Videos'} />
          <div className="row">
            {videos}
          </div>
        </div>
        </div>;



        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Course;
