import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Card, Header} from 'library';
import Nav from 'projectLibrary/nav.js';
import Sidebar from 'projectLibrary/sidebar.js';
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
        };
    }

    render() {

      var lastInstanceData = {'name':"Add Another Domain", 'description':"", 'link':"/newDomain/", 'button':"Create New", 'button_type':"success"};
      var dataMapping = {'button_type':'primary', 'button':'View', 'link':'/domain/{id}/', 'name':'{name}', 'description':'{domain_name}'};
      console.log("Dashboard", this.props.user_id)
      if (this.props.user_id) {
        return (
          <div>
          <Nav />
          <Sidebar domain={"None"} user={this.props.user_id} />
          <div className="container" style={{'marginTop':'100px'}}>
            <Header size={2} text={'Welcome To Slide Moji'} />
            <p>To Get Started Add A New Domain On The Left</p>
          </div>
          </div>
        );
      }
      else {
        return (
          <div>
            <Nav />
          </div>
        );
      }

    }
}

export default Dashboard;
