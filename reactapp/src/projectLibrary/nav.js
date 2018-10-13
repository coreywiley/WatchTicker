import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar} from 'library';

class Nav extends React.Component {
    constructor(props) {
      super(props)
      this.state = {'user_name':'', 'staff': false, 'logged_in':false, 'business':0, 'loaded':true}

      this.businessCallback = this.businessCallback.bind(this);
    }

    componentDidMount() {
      if (this.props.user_id) {
        ajaxWrapper('GET','/api/home/business/?owner=' + this.props.user_id,{}, this.businessCallback)
      }
    }

    businessCallback(result) {
      console.log("Nav Result", result)
      this.setState({business:result[0]['business']['id'], loaded:true})
    }

    render() {
        var name = <div><img style={{'marginRight':'10px'}} src='/static/images/logo.png' height="125" /></div>;
        console.log("Nav User Id", this.props.user_id)
        if (this.props.user_id) {
          var businessLink = ["/businessForm/",'Add Your Listing'];
          if (this.state.business != 0) {
            businessLink = ["/businessForm/" + this.state.business + '/','Edit Your Listing'];
          }
          var links = [['/how-it-works/','How It Works'], ['/deals/','Deals Of The Week'], ['/businesses/','Local Businesses'], businessLink, ['/editUser/','Account Details'], ['/logOut/','Log Out']];
        }
        else {
          var links = [['/how-it-works/','How It Works'], ['/deals/','Deals Of The Week'], ['/businesses/','Local Businesses'], ['/signUp/','Add Your Listing'], ['/signUp/','Sign Up'], ['/logIn/','Log In']];
        }

        return (
            <div>
              <Navbar nameLink={'/'} name={name} links={links} style={this.props.style} />
            </div>
        );
    }
}


export default Nav;
