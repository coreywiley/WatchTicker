import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar} from 'library';

class Nav extends React.Component {
    constructor(props) {
      super(props)
      this.state = {'user_name':'', 'staff': false, 'logged_in':false}
    }

    render() {
        var name = <div><img src='../../static/images/AnexLogo.PNG' height="30" width="30" /><strong>ANEX</strong></div>;
        var links = [['/events/','Events'],['/customers/','Customers'],['/menu/','Menu Items']];

        return (
            <Navbar nameLink={'/events/'} name={name} links={links} logOut={this.props.logOut} />
        );
    }
}


export default Nav;
