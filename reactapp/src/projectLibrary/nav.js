import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Button, GoogleAddress} from 'library';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

class Navbar extends React.Component {
    constructor(props) {
      super(props);

      this.state = {'search':'', 'location':'', 'mobile_search':false, address: '', street:'', state:'', street2:'', city:'',zipcode:''}

      this.search = this.search.bind(this);
      this.toggleSearch = this.toggleSearch.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleLocationChange = this.handleLocationChange.bind(this);
      this.setFormState = this.setFormState.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleKeyPress = (event) => {
      if(event.key == 'Enter') {
        this.search()
      }
    }

    handleChange = (e) => {
       var newState = {};
       newState['search'] = e.target.value;
       this.setState(newState);
    }

    handleLocationChange = (e) => {
       var newState = {};
       newState['location'] = e.target.value;
       this.setState(newState);
    }

    setFormState(newState) {
      console.log("New State", newState)
      this.setState(newState)
    }

    toggleSearch() {
      this.setState({'mobile_search': !this.state.mobile_search})
    }

    search() {
      window.location.href = '/deals/' + this.state.search + '/' + this.state.address.split(' ').join('_') + '/' + this.state.lat + ',' + this.state.lng + '/';
    }

    render() {
        var links = [];
        if (this.props.links) {
            for (var index in this.props.links) {
                links.push(<li key={index} className="nav-item"><a className="nav-link" style={{'min-width':'125px'}} href={this.props.links[index][0]}>{this.props.links[index][1]}</a></li>)
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
        //<input class="form-control mr-sm-2" type="search" placeholder="Location" aria-label="Search" value={this.state.location} onChange={this.handleLocationChange} style={{'width':'40%'}} />
        console.log("Nav details", this.props.style)

        if (this.state.mobile_search) {
          var content =<div>
            <nav className="navbar navbar-expand-lg navbar-dark nav-bg" style={this.props.style}>
              <div className="container" style={{'width':'100%'}}>
              <div className="row">
                <input onKeyPress={this.handleKeyPress} className="form-control" type="text" placeholder="Search" aria-label="Search" value={this.state.search} onChange={this.handleChange} style={{'marginLeft':'10px', 'marginRight':'10px'}}/><br/>
                <div style={{'marginTop':'5px', 'marginLeft':'10px', 'marginRight':'10px','width':'100%'}}>
                <GoogleAddress {...this.state} extras={false} setFormState={this.setFormState} />
                </div>
                <br/>
                <div>
                  <button className="btn btn-outline-light col-xs-4" onClick={this.toggleSearch} style={{'margin':'10px', 'width':'auto'}}>Cancel</button>
                  <div className="col-xs-4"></div>
                  <button className="btn btn-outline-search col-xs-4" onClick={this.search}  style={{'margin':'10px', 'width':'auto'}}><span className="fa fa-search"></span> Search</button>
                </div>
                </div>
              </div>
            </nav>
            </div>
        }
        else {


          var content =<div>
            <nav className="navbar navbar-expand-lg navbar-dark nav-bg" style={this.props.style}>
              <div className="container">
              <a className="navbar-brand" href={this.props.nameLink}>{this.props.name}</a>

                  <button class="btn btn-outline-search" onClick={this.toggleSearch}><span className="fa fa-search"></span> Search</button>


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
            <MobileView>
            <ul class="nav nav-pills nav-fill" style={{'height':'43px', 'borderBottom':'1px solid #eee', 'overflow-x':'scroll','flex-wrap':'nowrap', 'backgroundColor':'white', 'marginLeft':'0px'}}>
              {links}
            </ul>
            </MobileView>
            <BrowserView>
            <ul class="nav nav-pills nav-fill" style={{'height':'43px', 'borderBottom':'1px solid #eee', 'backgroundColor':'white'}}>
              {links}
            </ul>
            </BrowserView>
          </div>;
        }

        return (
            <div>
              {content}
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
          var signUpLinks = [['/how-it-works/','How It Works'], ['/businesses/','Local Businesses'], businessLink, ['/editUser/','Account Details'], ['/logOut/','Log Out']]
          var links = [['/deals/type:FoodAndDrink/','Food And Drink']];
        }
        else {
          var links = [['/deals/type:FoodAndDrink/','Food And Drink']];
          var signUpLinks = [['/how-it-works/','How It Works'], ['/businesses/','Local Businesses'], ['/signUp/business/','Add Your Listing'], ['/signUp/','Sign Up'], ['/logIn/','Log In']]
        }



        if (this.props.is_staff == true) {
          signUpLinks.push(['/appList/','Admin'])
          signUpLinks.push(['/manageBusinesses/','Manage Businesses'])
        }

        return (
          <div>
            <BrowserView>
              <div style={{'marginBottom':'150px'}}></div>
            </BrowserView>
            <MobileView>
              <div style={{'marginBottom':'140px'}}></div>
            </MobileView>
            <div style={{'position':'fixed', 'top':'0px','zIndex':10000, 'width':'100%'}}>
              <Navbar nameLink={'/'} name={name} links={links} style={this.props.style} signUpLinks={signUpLinks} />
            </div>
          </div>
        );
    }
}


export default Nav;
