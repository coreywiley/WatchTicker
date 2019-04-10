import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import settings from 'base/settings.js';
import {Navbar} from 'library';

class Nav extends React.Component {
    render() {
        var name = <div><img style={{'marginRight':'10px'}} src='/static/images/logo.png' height="125" /></div>;
        if (this.props.user_id) {
          var links = [['/viewer/', 'Pomodoros'],['/logOut/', 'Log Out']];
        }

        else {
          var links = [['/signUp/','Sign Up'], ['/logIn/','Log In']];
        }

        if (this.props.is_staff == true) {
          links.push(['/appList/','Admin']);
        }

        var linkHTML = [];
        for (var index in links) {
          linkHTML.push(<li className="nav-item">
             <a className="nav-link" data-value="about" href={links[index][0]}>{links[index][1]}</a>
          </li>)
        }

        return (
          <nav className="navbar navbar-expand-lg" style={{padding:'10px'}}>
            <a className="navbar-brand" href="#" style={{paddingLeft:'10px',paddingRight:'10px'}}>{settings.WEBSITE_NAME}</a>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse " id="navbarSupportedContent">
              <ul className="navbar-nav mr-4">
                {linkHTML}
              </ul>
            </div>
          </nav>
        );
    }
}


export default Nav;
