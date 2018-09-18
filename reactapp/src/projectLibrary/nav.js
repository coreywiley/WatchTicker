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
        <header className="header">
        <nav className="navbar navbar-expand-lg fixed-top"><a href="index.html" className="navbar-brand">Landy</a>
          <button type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler navbar-toggler-right"><span></span><span></span><span></span></button>
          <div id="navbarSupportedContent" className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto align-items-start align-items-lg-center">
              <li className="nav-item"><a href="#about-us" className="nav-link link-scroll">About Us</a></li>
              <li className="nav-item"><a href="#features" className="nav-link link-scroll">Features</a></li>
              <li className="nav-item"><a href="#testimonials" className="nav-link link-scroll">Testimonials</a></li>
              <li className="nav-item"><a href="text.html" className="nav-link">Text Page</a></li>
            </ul>
            <div className="navbar-text">
  <a href="#" data-toggle="modal" data-target="#exampleModal" className="btn btn-primary navbar-btn btn-shadow btn-gradient">Sign Up</a>
            </div>
          </div>
        </nav>
      </header>
    );
    }
}


export default Nav;
