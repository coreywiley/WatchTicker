import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar} from 'library';

class Nav extends React.Component {
    constructor(props) {
      super(props)
      this.state = {'user_name':'', 'staff': false, 'logged_in':false, 'business':0, 'loaded':true}

    }


    render() {
        var name = <div><img style={{'marginRight':'10px'}} src='/static/images/logo.png' height="125" /></div>;
        console.log("Nav User Id", this.props.user_id)
        if (this.props.user_id) {
          var businessLink = ["/manageYourBusinesses/",'Manage Your Businesses'];
          var links = [['/how-it-works/','How It Works'], ['/deals/','Deals Of The Week'], ['/businesses/','Local Businesses'], businessLink, ['/editUser/','Account Details'], ['/logOut/','Log Out']];
        }
        else {
          var links = [['/how-it-works/','How It Works'], ['/deals/','Deals Of The Week'], ['/businesses/','Local Businesses'], ['/signUp/business/','Add Your Listing'], ['/signUp/','Sign Up'], ['/logIn/','Log In']];
        }

        if (this.props.is_staff == true) {
          links.push(['/appList/','Admin'])
          links.push(['/manageBusinesses/','Manage Businesses'])
        }

        return (
            <div>
              <Navbar nameLink={'/'} name={name} links={links} style={this.props.style} />
            </div>
        );
    }
}


export default Nav;
