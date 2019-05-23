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
        if (this.props.user.id) {
          var links = [['/watches/', 'Watches'],['/sources/','Sources']];
        }

        else {
          var links = [['/logIn/','Log In']];
        }

        if (this.props.user.is_staff == true) {
          links.push(['/users/','Users']);
        }

        if (this.props.user.id) {
            links.push(['/logOut/', 'Log Out'])
        }

        var linkHTML = [];
        for (var index in links) {
          linkHTML.push(<li className="nav-item">
             <a className="nav-link" data-value="about" href={links[index][0]} style={{fontSize:'15px'}}>{links[index][1]}</a>
          </li>)
        }

        return (

              <nav class="navbar top-navbar navbar-expand-md navbar-dark" style={{marginBottom:'30px'}}>
                  <div class="navbar-header" style={{margin:'3px'}}>
                      <a class="navbar-brand" href="/watches/" style={{'fontSize':'25px'}}>Watch Ticker</a>
                  </div>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
                  <div class="collapse navbar-collapse" id="navbarSupportedContent">
                      <ul class="navbar-nav mr-auto">
                         {linkHTML}
                      </ul>
                  </div>
              </nav>

        );
    }
}


export default Nav;
