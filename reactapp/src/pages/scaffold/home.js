import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header} from 'library';
import Nav from 'projectLibrary/nav.js';
import Sidebar from 'projectLibrary/loggedOutSidebar.js';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true
        };
    }

    setGlobalState() {

    }

    render() {
      var content =
      <div className="container" style={{'marginTop':'100px'}}>
            <div className="jumbotron">
              <h1>Emoji Slider!</h1>
              <p className="lead">Get instant engagement with your polls and questions using an emoji slider.</p>
              <p><Button href={'/signUp/'} text={"Sign Up"} type={'success'} /></p>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <h2>Advertise To Specific Answers</h2>
                <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
              </div>
              <div className="col-lg-4">
                <h2>Track your data.</h2>
                <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
             </div>
              <div className="col-lg-4">
                <h2>Delight your viewers</h2>
                <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa.</p>
              </div>
            </div>
            <footer className="footer">
              <p>© Company 2017</p>
            </footer>

          </div>;

        return (
          <div>
          <Nav />
          <Sidebar />
          <Wrapper loaded={true} content={content} />
          </div>
        );
    }
}



export default Home;
