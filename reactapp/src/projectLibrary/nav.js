import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar} from 'library';

class Nav extends React.Component {

    render() {
        var name = <div><strong>Catering</strong></div>;
        if (this.props.logged_in == true) {
          var links = [['/events/','Events'],['/customers/','Customers'],['/menuItems/','Menu Items']];
          var nameLink = '/events/'
        }
        else {
          var links = [];
          var nameLink = '/'
        }


      return (
      <header className="topbar">
    <div className="topbar-left">
      <span className="topbar-btn sidebar-toggler"><i>☰</i></span>
    </div>
  </header>);
    }
}


export default Nav;
