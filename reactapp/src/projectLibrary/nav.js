import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import settings from 'base/settings.js';
import {Navbar, NumberInput} from 'library';

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [

            ],
            can_have_children: true,
        }
    }

    render() {
        var name = <div><img style={{'marginRight':'10px'}} src='/static/images/logo.png' height="125" /></div>;
        if (this.props.user) {
          var links = [['/watches/', 'Watches']];
        }

        else {
          var links = [['/logIn/','Log In']];
        }

        if (this.props.user.is_staff == true) {
          links.push(['/users/','Users']);
        }

        if (this.props.user) {
            links.push(['/logOut/', 'Log Out'])
        }

        var linkHTML = [];
        for (var index in links) {
          linkHTML.push(<li className="nav-item">
             <a className="nav-link" data-value="about" href={links[index][0]}>{links[index][1]}</a>
          </li>)
        }

        return (
            <header class="topbar">
              <nav class="navbar top-navbar navbar-expand-md navbar-dark">
                  <div class="navbar-header">
                      <a class="navbar-brand" href="/watches/">Watch Ticker</a>
                  </div>
                  <div class="navbar-collapse">
                      <ul class="navbar-nav mr-auto">
                         {linkHTML}
                      </ul>
                  </div>
              </nav>
          </header>
        );
    }
}


export default Nav;
