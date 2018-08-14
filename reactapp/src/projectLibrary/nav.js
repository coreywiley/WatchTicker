import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar} from 'library';

class Nav extends React.Component {
    constructor(props) {
      super(props)
      this.state = {'user_name':'', 'staff': false, 'logged_in':false}
      this.userCallback = this.userCallback.bind(this);
    }

    componentDidMount() {
      if (this.props.token) {
        ajaxWrapper('GET','/api/user/user/' + this.props.token + '/', {}, this.userCallback)
      }
    }

    userCallback(result) {
      var user = result[0]['user'];
      var user_name = user['first_name'] + ' ' + user['last_name'];
      var staff = user['is_staff']
      this.setState({user_name:user_name, staff:staff, logged_in:true})

    }

    render() {
        var name = <div><img src='../../static/images/AnexLogo.PNG' height="30" width="30" /><strong>ANEX</strong></div>;
        var links = [['#','Analyst: ' + this.state.user_name],['/projects/','Projects']];
        if (this.state.staff == true) {
          links.push(['/appList/','Admin Panel'])
        }

        return (
            <Navbar nameLink={'/projects/'} name={name} links={links} logOut={this.props.logOut} />
        );
    }
}


export default Nav;
