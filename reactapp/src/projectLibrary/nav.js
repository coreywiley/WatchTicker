import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import settings from 'base/settings.js';
import {Navbar} from 'library';

class Nav extends React.Component {
    render() {
        var name = <div><img style={{'marginRight':'10px'}} src='/static/images/logo.png' height="125" /></div>;
        if (this.props.user_id) {
          var links = [];
        }

        else {
          var links = [['/signUp/','Sign Up'], ['/logIn/','Log In']];
        }

        if (this.props.is_staff == true) {
          links.push(['/appList/','Admin']);
        }

        return (
          <nav className="navbar navbar-expand-lg fixed-top" style={{padding:'10px'}}>
            <a className="navbar-brand" href="#" style={{paddingLeft:'10px',paddingRight:'10px'}}>{settings.WEBSITE_NAME}</a>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse " id="navbarSupportedContent">
              <ul className="navbar-nav mr-4">
                <li className="nav-item">
                   <a className="nav-link" data-value="about" href="/viewer/">Tasks</a>
                </li>

                <li className="nav-item">
                  <a className="nav-link " data-value="portfolio"href="/analytics/">Analytics</a>
                </li>

              </ul>
            </div>
          </nav>
        );
    }
}


export default Nav;
