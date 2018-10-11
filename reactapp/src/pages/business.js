import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, TextArea, Card, Button} from 'library';

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
      }
      else {
        ajaxWrapper('POST','/api/home/follow/' + this.state.follow.id + '/', {'notifications':true}, this.changeFollowCallback)
      }
    }

    publish() {
      if (this.state.published == true) {
          ajaxWrapper('POST','/api/home/business/' + this.props.business_id + '/', {'published':false}, () => this.setState({'published':false}))
      }
      else {
        ajaxWrapper('POST','/api/home/business/' + this.props.business_id + '/', {'published':true}, () => this.setState({'published':true}))
      }
    }

    deleteFollow() {
      this.setState({follow:{}})
    }

    render() {

        var dealCards = [];
        for (var index in this.state.deals) {
          dealCards.push(<Card name={this.state.deals[index]['deal']['name']} description={this.state.deals[index]['deal']['description']} button={'Read More'} button_type={'primary'} link={'/deal/' + this.state.deals[index]['deal']['id'] + '/'} />)
        }

        var publish = <div></div>
        if (this.props.user_id == this.state.owner) {
          console.log("You own this business")
          if (this.state.published == false) {
            publish = <Button clickHandler={this.publish} type={'success'} text={'Publish Your Business On Patron Gate'} />
          }
          else {
            publish = <Button clickHandler={this.publish} type={'danger'} text={'Hide Your Business On Patron Gate Results'} />
          }
        }

        var following = <Button clickHandler={this.follow} type={'success'} text={'Follow'} />
        var notifications = <div></div>
        if (this.state.follow.id) {
          following = <Button clickHandler={this.follow} type={'danger'} text={'Un-Follow'} />
          if (this.state.follow.notifications == true) {
            notifications = <Button clickHandler={this.notify} type={'danger'} text={'Turn Off Notifications'} />
          }
          else {
            notifications = <Button clickHandler={this.notify} type={'success'} text={'Notify Me Of New Deals'} />
          }

        }

        var content = <div className="container">
                <h2>{this.state.name}</h2>
                {publish}
                <p>{this.state.description}</p>
                <p>{this.state.email}</p>
                <p>{this.state.phone}</p>
                <p>{this.state.website}</p>
                <p>{this.state.address}</p>
                {following}
                {notifications}
                <h3>Active Deals</h3>
                {dealCards}
        </div>;


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Business;
