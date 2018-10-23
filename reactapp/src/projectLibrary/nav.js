import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
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
            <div>
              <Navbar nameLink={'/'} name={name} links={links}
                style={this.props.style} logOut={this.props.logOut} />
            </div>
        );
    }
}


export default Nav;
