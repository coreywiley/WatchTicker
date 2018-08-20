import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar} from 'library';

class Nav extends React.Component {
    constructor(props) {
      super(props)
      this.state = {'user_name':'', 'staff': false, 'logged_in':false}
    }

    render() {
        var name = <div><img style={{'marginRight':'10px'}} src='https://cdn.shopify.com/s/files/1/1061/1924/files/Money_Face_Emoji.png?9898922749706957214' height="30" width="30" /><strong>Emoji Slider</strong></div>;
        var links = [['/dashboard/','Dashboard']];

        return (
            <Navbar nameLink={'/'} name={name} links={links} logOut={this.props.logOut} />
        );
    }
}


export default Nav;
