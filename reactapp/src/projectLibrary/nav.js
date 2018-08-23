import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar} from 'library';

class Nav extends React.Component {

    render() {

      return (
      <header className="topbar">
    <div className="topbar-left">
      <span className="topbar-btn sidebar-toggler"><i>☰</i></span>
    </div>
  </header>);
    }
}


export default Nav;
