import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar} from 'library';

class Nav extends React.Component {
    constructor(props) {
      super(props)
      this.state = {'user_name':'', 'staff': false, 'logged_in':false}
    }

    render() {
        var name = <div><img src='/static/images/CaterLister.png' style={{'height':'30px'}} /></div>;
        if (this.props.logged_in == true) {
          var links = [['/events/','Events'],['/customers/','Customers'],['/menuItems/','Menu Items']];
          var nameLink = '/events/'
        }
        else {
          var links = [];
          var nameLink = '/'
        }


        return (
            <Navbar nameLink={nameLink} name={name} links={links} logOut={this.props.logOut} />
        );
    }
}


export default Nav;
