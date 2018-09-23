import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar, Header} from 'library';

class Nav extends React.Component {

    render() {
        var name = <div><Header size={3} text={'ARGNNN'} /></div>;
        var navbarComponent = <div></div>;
        if (this.props.logged_in == true) {
          var links = [['/projects/','Projects']];
          var nameLink = '/events/'
          var navbarComponent = <Navbar links={links} nameLink={nameLink} name={name} logOut={this.props.logOut} />
        }
        else {
          var links = [];
          var nameLink = '/'
          var navbarComponent = <Navbar links={links} nameLink={nameLink} name={name} />
        }


      return (
        <div>
          {navbarComponent}
        </div>
    );
    }
}


export default Nav;
