import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Card, Header} from 'library';
import Nav from 'projectLibrary/nav.js';

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
          <div className="container">
            <Header size={2} text={'Domains'} />
            <List dataUrl={"/api/home/domain/?user=" + this.props.user_id} component={Card} objectName={'domain'} dataMapping={dataMapping} lastInstanceData={lastInstanceData} />
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
