import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Button} from 'library';

class Navbar extends React.Component {
    constructor(props) {
      super(props);

      this.state = {'search':''}

      this.search = this.search.bind(this);
    }

    handleChange = (e) => {
       var newState = {};
       newState['search'] = e.target.value;
       this.setState(newState);
    }

    search() {
      window.location.href = '/deals/' + this.state.search + '/'
    }

    render() {
        var links = [];
        if (this.props.links) {
            for (var index in this.props.links) {
                links.push(<li key={index} className="nav-item"><a className="nav-link" href={this.props.links[index][0]}>{this.props.links[index][1]}</a></li>)
            }
        }


        var signUpLinks = []
        if (this.props.signUpLinks) {
            for (var index in this.props.signUpLinks) {
                signUpLinks.push(<li key={index} className="nav-item"><a style={{'color':'white'}} className="nav-link" href={this.props.signUpLinks[index][0]}>{this.props.signUpLinks[index][1]}</a></li>)
            }
        }

        var logOut = <div></div>
        if (this.props.logOut) {
          logOut = <div className="form-inline">
            <Button type={'danger'} text={'Log Out'} clickHandler={this.props.logOut} />
          </div>
        }

        console.log("Nav details", this.props.style)

        return (
            <div>
              <nav className="navbar navbar-expand-lg navbar-dark nav-bg" style={this.props.style}>
                <div className="container">
                <a className="navbar-brand" href={this.props.nameLink}>{this.props.name}</a>

                <div class="form-inline" style={{'width':'50%'}}>
                  <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" value={this.state.search} onChange={this.handleChange} style={{'width':'75%'}} />
                  <button class="btn btn-outline-search my-2 my-sm-0" onClick={this.search}><span className="fa fa-search"></span></button>
                </div>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav ml-auto">
                    {signUpLinks}
                  </ul>
                </div>
                </div>
              </nav>
              <ul class="nav nav-pills nav-fill" style={{'height':'43px', 'borderBottom':'1px solid #eee'}}>
                {links}
              </ul>
            </div>
        );
    }
}




class Nav extends React.Component {
    constructor(props) {
      super(props)
      this.state = {'user_name':'', 'staff': false, 'logged_in':false, 'business':0, 'loaded':true}

    }


    render() {
        var name = <div style={{'fontWeight':'bolder'}}>PATRONGATE</div>;
        console.log("Nav User Id", this.props.user_id)
        if (this.props.user_id) {
          var businessLink = ["/manageYourBusinesses/",'Manage Your Businesses'];
          var signUpLinks = [['/editUser/','Account Details'], ['/logOut/','Log Out']]
          var links = [['/how-it-works/','How It Works'], ['/deals/','Deals Of The Week'], ['/businesses/','Local Businesses'], businessLink];
        }
        else {
          var links = [['/how-it-works/','How It Works'], ['/deals/','Deals Of The Week'], ['/businesses/','Local Businesses'], ['/signUp/business/','Add Your Listing']];
          var signUpLinks = [['/signUp/','Sign Up'], ['/logIn/','Log In']]
        }



        if (this.props.is_staff == true) {
          links.push(['/appList/','Admin'])
          links.push(['/manageBusinesses/','Manage Businesses'])
        }

        return (
            <div>
              <Navbar nameLink={'/'} name={name} links={links} style={this.props.style} signUpLinks={signUpLinks} />
            </div>
        );
    }
}


export default Nav;
