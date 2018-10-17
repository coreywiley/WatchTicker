import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, TextArea, Button, Header} from 'library';
import Card from 'projectLibrary/dealCard.js';

class Business extends Component {
    constructor(props) {
      super(props);
      this.state = {'follow':{}, 'deals': [], 'published':false, 'name':'','description':'', 'email':'', 'phone': '', 'website':'','owner': this.props.user_id, 'address':'', 'street':'', 'street2':'', 'city':'','state':'','zipcode':'', 'loaded':false};

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
        ajaxWrapper('GET','/api/home/business/' + this.props.business_id + '/?related=deals', {}, this.businessCallback)
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
        console.log("Create")
        ajaxWrapper('POST','/api/home/follow/',{'user':this.props.user_id, 'business':this.props.business_id},this.changeFollowCallback)
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

        var dealCards = [];
        for (var index in this.state.deals) {
          dealCards.push(<Card imageUrl={this.state.deals[index]['deal']['main_image']} imageAlt={this.state.deals[index]['deal']['name']} name={this.state.deals[index]['deal']['name']} description={this.state.deals[index]['deal']['description']} button={'Read More'} button_type={'primary'} link={'/deal/' + this.state.deals[index]['deal']['id'] + '/'} />)
        }

        var publish = <div></div>
        var newDeal = <div></div>

        if (this.props.is_staff == true) {
          publish = <div style={{'paddingTop':'10px', paddingBottom: '10px'}}><div style={{'float':'left'}}></div><div style={{'float':'right'}}><Button href={"/businessForm/" + this.state.id + "/"} type={'patron'} text={'Edit Details'} /></div></div>
        }
        else if (this.props.user_id == this.state.owner) {
          newDeal = <Button href={'/dealForm/' + this.props.business_id + '/'} text={'New Deal'} type={'patron'} />
          if (this.state.ask_for_publish == false) {
            publish = <div style={{'paddingTop':'10px', paddingBottom: '10px'}}><div style={{'float':'left'}}><Button clickHandler={this.publish} type={'success'} text={'Submit For Approval To Publish Your Business On Patron Gate'} /></div><div style={{'float':'right'}}><Button href={"/businessForm/" + this.state.id + "/"} type={'patron'} text={'Edit Details'} /></div></div>
          }
          else {
            publish = <div style={{'paddingTop':'10px', paddingBottom: '10px'}}><div style={{'float':'left'}}><Button clickHandler={this.publish} type={'danger'} text={'Hide Your Business On Patron Gate Results'} /></div><div style={{'float':'right'}}><Button href={"/businessForm/" + this.state.id + "/"} type={'patron'} text={'Edit Details'} /></div></div>
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

        var facebook = <div></div>
        if (this.state.facebook != '') {
          facebook = <a href={this.state.facebook} target='_blank'><i class="fa fa-facebook fa-2x" aria-hidden="true" style={{'padding':'5px'}}></i></a>
        }

        var twitter = <div></div>
        if (this.state.twitter != '') {
          twitter = <a href={this.state.twitter} target='_blank'><i class="fa fa-twitter fa-2x" aria-hidden="true" style={{'padding':'5px'}}></i></a>
        }

        var instagram = <div></div>
        if (this.state.instagram != '') {
          instagram = <a href={this.state.instagram} target='_blank'><i class="fa fa-instagram fa-2x" aria-hidden="true" style={{'padding':'5px'}}></i></a>
        }

        var yelp = <div></div>
        if (this.state.yelp != '') {
          yelp = <a href={this.state.yelp} target='_blank'><i class="fa fa-yelp fa-2x" aria-hidden="true" style={{'padding':'5px'}}></i></a>
        }

        var specials = []
        if (this.state.monday_special != '') {
          specials.push(<p><strong>Monday - </strong>{this.state.monday_special}</p>)
        }
        if (this.state.tuesday_special != '') {
          specials.push(<p><strong>Tuesday - </strong>{this.state.tuesday_special}</p>)
        }
        if (this.state.wednesday_special != '') {
          specials.push(<p><strong>Wednesday - </strong>{this.state.wednesday_special}</p>)
        }
        if (this.state.thursday_special != '') {
          specials.push(<p><strong>Thursday - </strong>{this.state.thursday_special}</p>)
        }
        if (this.state.friday_special != '') {
          specials.push(<p><strong>Friday - </strong>{this.state.friday_special}</p>)
        }
        if (this.state.saturday_special != '') {
          specials.push(<p><strong>Saturday - </strong>{this.state.saturday_special}</p>)
        }
        if (this.state.sunday_special != '') {
          specials.push(<p><strong>Sunday - </strong>{this.state.sunday_special}</p>)
        }

        var specialsDisplay = <div></div>
        if (specials.length > 0) {
          specialsDisplay = <div><Header text={'Weekly Specials'} size={3} />{specials}</div>
        }

        var content = <div className="container">
              <MetaTags>
                <title>{this.state.name} | PatronGate</title>
                <meta name="description" content={this.state.description} />
                <meta property="og:title" content={this.state.name} />
              </MetaTags>
                <div className='col-md-8'>
                {publish}
                <h2 style={{'paddingTop':'10px', paddingBottom: '10px'}}>{this.state.name}</h2>
                <p>{this.state.address}</p>
                <img src={this.state.main_image} style={{'width':'100%'}} />
                {following}
                {notifications}
                {specialsDisplay}
                <h4>About {this.state.name}</h4>
                <p>{this.state.description}</p>
                </div>
                <div className='col-md-4'>
                  <h3>Contact {this.state.name}</h3>
                  <div style={{'marginLeft':'10px'}}>
                    {email}
                    {phone}
                    {website}
                    <p style={{fontSize:'15px', 'color':'#234f9c', 'marginBottom':'5px'}}><i class="fa fa-car" aria-hidden="true"></i> <a href={"https://www.google.com/maps/place/" + this.state.address} target="_blank">Get Directions</a></p>
                    <div id="socialMedia">
                      <h3>Social Profiles</h3>
                      {facebook}
                      {twitter}
                      {instagram}
                      {yelp}
                    </div>
                  </div>
                </div>

                <h3 style={{'paddingTop':'35px'}}>Active Deals</h3>
                {newDeal}
                {dealCards}
        </div>;


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Business;
