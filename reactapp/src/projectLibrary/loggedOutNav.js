import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar} from 'library';

class Nav extends React.Component {
    constructor(props) {
      super(props)
      this.state = {'user_name':'', 'staff': false, 'logged_in':false}
    }

    render() {
        var name = <div><img style={{'marginRight':'10px'}} src='/static/images/logo.png' height="35" /></div>;
        var links = [['/logIn/','Log In'], ['/signUp/','Sign Up']];

        return (
            <div style={{'marginBottom':'10px'}}>
            <Navbar nameLink={'/'} name={name} links={links} />
            </div>
        );
    }
}


export default Nav;
