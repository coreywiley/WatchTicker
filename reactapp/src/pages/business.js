import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, TextArea, Button, Header, MultiLineText, PageBreak} from 'library';
import Card from 'projectLibrary/dealCard.js';
import Review from 'projectLibrary/review.js';

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

class Business extends Component {
    constructor(props) {
      super(props);
      this.state = {'follow':{}, 'followAttempt':false, 'deals': [], 'review':[], 'published':false, 'name':'','description':'', 'email':'', 'phone': '', 'website':'','owner': this.props.user_id, 'address':'', 'street':'', 'street2':'', 'city':'','state':'','zipcode':'', 'loaded':false};

      this.businessCallback = this.businessCallback.bind(this);
      this.followCallback = this.followCallback.bind(this);
      this.follow = this.follow.bind(this);
      this.changeFollowCallback = this.changeFollowCallback.bind(this);
      this.notify = this.notify.bind(this);
      this.deleteFollow = this.deleteFollow.bind(this);
      this.publish = this.publish.bind(this);
    }

    componentDidMount() {
        this.changeFollowCallback();
        ajaxWrapper('GET','/api/home/business/' + this.props.business_id + '/?related=deals,review,review__user', {}, this.businessCallback)
    }

    changeFollowCallback() {
      ajaxWrapper('GET','/api/home/follow/?business=' + this.props.business_id + '&user=' + this.props.user_id, {}, this.followCallback)
    }

    businessCallback(result) {
      var business = result[0]['business']
      business['owner'] = business['owner_id']
      business['loaded'] = true
      this.setState(business)
    }

    followCallback(result) {
      if (result.length > 0) {
        var follow = result[0];
        follow['followAttempt'] = false;
        this.setState(result[0])
      }
    }

    follow() {
      console.log("Follow!")
      if (this.state.follow.id) {
        console.log("Delete")
        ajaxWrapper('POST','/api/home/follow/' + this.state.follow.id + '/delete/',{},this.deleteFollow)
      }
      else {
        if (this.state.followAttempt == false) {
          console.log("Create")
          this.setState({'followAttempt':true}, ajaxWrapper('POST','/api/home/follow/',{'user':this.props.user_id, 'business':this.props.business_id},this.changeFollowCallback))
        }
      }

    }

    notify() {
      if (this.state.follow.notifications == true) {
          ajaxWrapper('POST','/api/home/follow/' + this.state.follow.id + '/', {'notifications':false}, this.changeFollowCallback)
          var follow = this.state.follow;
          follow.notifications = false;
          this.setState({follow:follow})
      }
      else {
        ajaxWrapper('POST','/api/home/follow/' + this.state.follow.id + '/', {'notifications':true}, this.changeFollowCallback)
        var follow = this.state.follow;
        follow.notifications = true;
        this.setState({follow:follow})
      }
    }

    publish() {
      if (this.state.published == true) {
          ajaxWrapper('POST','/api/home/business/' + this.props.business_id + '/', {'published':false}, () => this.setState({'published':false}))
      }
      else {
        ajaxWrapper('POST','/api/home/business/' + this.props.business_id + '/', {'ask_for_publish':true}, () => this.setState({'ask_for_publish':true}))
      }
    }

    deleteFollow() {
      this.setState({follow:{}})
    }

    render() {

      var reviews = [];
      if (this.state.review && this.state.review.length == 0) {
        reviews = <p>There are no reviews yet.</p>
      }
      else {
        for (var index in this.state.review) {
          var review = this.state.review[index]['review']
          reviews.push(<Review {...review} />)
        }
      }

        var dealCards = [];
        var unPublishedDealCards = [];
        for (var index in this.state.deals) {
          var deal = this.state.deals[index];
          console.log("Deal?", deal)
          if (this.state.deals[index]['deal']['published'] == true) {
            dealCards.push(<Card imageUrl={this.state.deals[index]['deal']['main_image']} imageAlt={this.state.deals[index]['deal']['name']} name={this.state.deals[index]['deal']['name']} description={this.state.deals[index]['deal']['description']} button={'Read More'} button_type={'primary'} link={'/deal/' + this.state.deals[index]['deal']['id'] + '/'} />)
          }
          else {
            unPublishedDealCards.push(<Card imageUrl={this.state.deals[index]['deal']['main_image']} imageAlt={this.state.deals[index]['deal']['name']} name={this.state.deals[index]['deal']['name']} description={this.state.deals[index]['deal']['description']} button={'Read More'} button_type={'primary'} link={'/deal/' + this.state.deals[index]['deal']['id'] + '/'} />)
          }
        }

        var publish = <div></div>
        var newDeal = <div></div>
        var allDeals = <div></div>;

        if (this.props.is_staff == true) {
          newDeal = <Button href={'/dealForm/' + this.props.business_id + '/'} text={'New Deal'} type={'patron'} />
          publish = <div style={{'paddingTop':'10px', paddingBottom: '10px'}}><div style={{'float':'left'}}></div><div style={{'float':'right'}}><Button href={"/businessForm/" + this.state.id + "/"} type={'patron'} text={'Edit Details'} /><Button href={"/couponMetrics/" + this.state.id + "/"} type={'patron'} text={'View Redemptions'} /></div></div>
          allDeals = <div><br /><br /><h3>Unpublished Deals (Only visible to business owner and patron gate staff)</h3>{unPublishedDealCards}</div>
        }
        if (this.props.user_id == this.state.owner) {
          newDeal = <Button href={'/dealForm/' + this.props.business_id + '/'} text={'New Deal'} type={'patron'} />
          allDeals = <div><br /><br /><h3>Unpublished Deals (Only visible to business owner and patron gate staff)</h3>{unPublishedDealCards}</div>
          if (this.state.ask_for_publish == false) {
            publish = <div style={{'paddingTop':'10px', paddingBottom: '10px'}}><div style={{'float':'left'}}><Button clickHandler={this.publish} type={'success'} text={'Submit For Approval To Publish Your Business On Patron Gate'} /></div><div style={{'float':'right'}}><Button href={"/businessForm/" + this.state.id + "/"} type={'patron'} text={'Edit Details'} /><Button href={"/couponMetrics/" + this.state.id + "/"} type={'patron'} text={'View Redemptions'} /></div></div>
          }
          else {
            publish = <div style={{'paddingTop':'10px', paddingBottom: '10px'}}><div style={{'float':'left'}}><Button clickHandler={this.publish} type={'danger'} text={'Hide Your Business On Patron Gate Results'} /></div><div style={{'float':'right'}}><Button href={"/businessForm/" + this.state.id + "/"} type={'patron'} text={'Edit Details'} /><Button href={"/couponMetrics/" + this.state.id + "/"} type={'patron'} text={'View Redemptions'} /></div></div>
          }
        }


        if (this.props.user_id) {
          var following = <p onClick={this.follow}  style={{fontSize:'15px', margin: '0px'}}><i style={{'color':' orange'}} class="fa fa-star-o" aria-hidden="true"></i> Favorite {this.state.name}</p>
        }
        else {
          var following = <Button href={"/signUp/"} type={'patron'} text={'Sign Up To Get Notified Of Deals'} />
        }

        var notifications = <div></div>
        if (this.state.follow.id) {
          following = <p onClick={this.follow}  style={{fontSize:'15px', margin:'0px'}}><i style={{'color':' orange'}} class="fa fa-star" aria-hidden="true"></i> Favorite {this.state.name}</p>
          if (this.state.follow.notifications == true) {
            notifications = <p onClick={this.notify}  style={{fontSize:'15px'}}><i style={{'color':' #234f9c'}} class="fa fa-check-square-o" aria-hidden="true"></i> Notify Me About New Deals</p>

          }
          else {
            notifications = <p onClick={this.notify} style={{fontSize:'15px'}}><i style={{'color':'#234f9c'}} class="fa fa-square-o" aria-hidden="true"></i> Notify Me About New Deals</p>
          }

        }

        var email = <div></div>
        if (this.state.email != '') {
          email = <p style={{fontSize:'15px', 'color':'#234f9c', 'marginBottom':'5px'}}><i class="fa fa-envelope" aria-hidden="true"></i> {this.state.email}</p>
        }

        var phone = <div></div>
        if (this.state.phone != '') {
          phone = <p style={{fontSize:'15px', 'color':'#234f9c', 'marginBottom':'5px'}}><i className="fa fa-phone" aria-hidden="true"></i> {this.state.phone}</p>
        }

        var website = <div></div>
        if (this.state.website != '') {
          website = <p style={{fontSize:'15px', 'color':'#234f9c', 'marginBottom':'5px'}}><i class="fa fa-globe" aria-hidden="true"></i> <a href={this.state.website} target="_blank">Visit Website</a></p>
        }

        var social = false;
        var facebook = <div></div>
        if (this.state.facebook != '') {
          social = true;
          facebook = <a href={this.state.facebook} target='_blank'><i class="fa fa-facebook fa-2x" aria-hidden="true" style={{'padding':'5px'}}></i></a>
        }

        var twitter = <div></div>
        if (this.state.twitter != '') {
          social = true;
          twitter = <a href={this.state.twitter} target='_blank'><i class="fa fa-twitter fa-2x" aria-hidden="true" style={{'padding':'5px'}}></i></a>
        }

        var instagram = <div></div>
        if (this.state.instagram != '') {
          social = true;
          instagram = <a href={this.state.instagram} target='_blank'><i class="fa fa-instagram fa-2x" aria-hidden="true" style={{'padding':'5px'}}></i></a>
        }

        var yelp = <div></div>
        if (this.state.yelp != '') {
          social = true;
          yelp = <a href={this.state.yelp} target='_blank'><i class="fa fa-yelp fa-2x" aria-hidden="true" style={{'padding':'5px'}}></i></a>
        }

        var specials = []
        if (this.state.monday_special != '') {
          specials.push(<p><strong>Monday - </strong><MultiLineText text={this.state.monday_special} /></p>)
        }
        if (this.state.tuesday_special != '') {
          specials.push(<p><strong>Tuesday - </strong><MultiLineText text={this.state.tuesday_special} /></p>)
        }
        if (this.state.wednesday_special != '') {
          specials.push(<p><strong>Wednesday - </strong><MultiLineText text={this.state.wednesday_special} /></p>)
        }
        if (this.state.thursday_special != '') {
          specials.push(<p><strong>Thursday - </strong><MultiLineText text={this.state.thursday_special} /></p>)
        }
        if (this.state.friday_special != '') {
          specials.push(<p><strong>Friday - </strong><MultiLineText text={this.state.friday_special} /></p>)
        }
        if (this.state.saturday_special != '') {
          specials.push(<p><strong>Saturday - </strong><MultiLineText text={this.state.saturday_special} /></p>)
        }
        if (this.state.sunday_special != '') {
          specials.push(<p><strong>Sunday - </strong><MultiLineText text={this.state.sunday_special} /></p>)
        }

        var specialsDisplay = <div></div>
        if (specials.length > 0) {
          specialsDisplay = <div><Header text={'Weekly Specials'} size={3} />{specials}</div>
        }

        var container = 'container';

        var about = null;
        if (this.state.description != "") {
          var about = <div>
          <h4>About {this.state.name}</h4>
          <MultiLineText text={this.state.description} />
          </div>
        }

        var businessDetails = <div className='col-md-8' style={{'borderRight':'1px solid #ccc', 'paddingRight':'10px'}}>
                        {publish}
                        <h2 style={{'paddingTop':'10px', 'marginBottom': '0px'}}>{this.state.name}</h2>
                        <p>{this.state.address}</p>
                        <img src={this.state.main_image} style={{'width':'100%'}} />
                        {following}
                        {notifications}
                        {specialsDisplay}
                        {about}
                        <br/>
                        <h3 style={{'marginTop':'20px', 'marginBottom':'2px'}}>Customer Reviews</h3>
                        <PageBreak />
                        <br/>
                        {reviews}
                        <br/>
                        <iframe src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyDnsYmrV7t2Bx5DH0NFcb5eSFR-Ii4kMb4&q=" + this.state.address} width="800" height="600" frameborder="0" style={{'border':'0'}} allowfullscreen></iframe>
                        </div>

        if (isMobile) {
          container= 'container-fluid';
          businessDetails = <div>
                          {publish}
                          <h2 style={{'paddingTop':'10px', 'paddingLeft':'15px', 'marginBottom': '0px'}}>{this.state.name}</h2>
                          <p style={{'paddingLeft':'15px'}}>{this.state.address}</p>
                          <img src={this.state.main_image} style={{'width':'100%'}} />
                          <div style={{'paddingLeft':'15px'}}>
                          {following}
                          {notifications}
                          {specialsDisplay}
                          <h4>About {this.state.name}</h4>
                          <MultiLineText text={this.state.description} />
                          <br/>
                          <h3 style={{'marginTop':'20px', 'marginBottom':'2px'}}>Customer Reviews</h3>
                          <PageBreak />
                          <br/>
                          {reviews}
                          <br/>
                          <iframe src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyDnsYmrV7t2Bx5DH0NFcb5eSFR-Ii4kMb4&q=" + this.state.address} width="800" height="600" frameborder="0" style={{'border':'0'}} allowfullscreen></iframe>
                          </div>
                          </div>

        }

        var social_profiles = null;
        if (social) {
          var social_profiles = <div id="socialMedia">
            <h3>Social Profiles</h3>
            {facebook}
            {twitter}
            {instagram}
            {yelp}
          </div>
        }

        var active_deals = <div>
        {allDeals}
        {newDeal}
        </div>;

        if (dealCards.length > 0) {
          active_deals = <div>
          <h3 style={{'paddingTop':'35px'}}>Active Deals</h3>
          {newDeal}
          {dealCards}
          {allDeals}
          </div>
        }

        var content = <div className={container} style={{'padding':'0px'}}>
              <MetaTags>
                <title>{this.state.name} | PatronGate</title>
                <meta name="description" content={this.state.description} />
                <meta property="og:title" content={this.state.name} />
              </MetaTags>
                {businessDetails}
                <div className='col-md-4 col-xs-12' style={{'paddingLeft':'10px'}}>
                  <h3>Contact {this.state.name}</h3>
                  <div style={{'marginLeft':'10px'}}>
                    {email}
                    {phone}
                    {website}
                    <p style={{fontSize:'15px', 'color':'#234f9c', 'marginBottom':'5px'}}><i class="fa fa-car" aria-hidden="true"></i> <a href={"https://www.google.com/maps/place/" + this.state.address} target="_blank">Get Directions</a></p>
                    {social}
                  </div>
                </div>

                {active_deals}


        </div>;


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Business;
