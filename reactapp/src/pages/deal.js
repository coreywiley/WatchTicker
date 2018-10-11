import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, TextArea, Link, Button} from 'library';

class Deal extends Component {
    constructor(props) {
      super(props);
      this.state = {'business':{'name':'', 'id':0}, 'name':'','description':'', 'published':false, 'emails_sent':false, 'redeemable':true};

      this.dealCallback = this.dealCallback.bind(this);
      this.publish = this.publish.bind(this);
      this.remove = this.remove.bind(this);
      this.followCallback = this.followCallback.bind(this);
      this.redeem = this.redeem.bind(this);
      this.redeemed = this.redeemed.bind(this);
    }

    componentDidMount() {
        ajaxWrapper('GET','/api/home/deal/' + this.props.deal_id + '/?related=business', {}, this.dealCallback)
    }

    dealCallback(result) {
      var deal = result[0]['deal']
      deal['loaded'] = true
      this.setState(deal)
    }

    followCallback(result) {
      var emails_sent = 0;
      for (var index in result) {
        if (result[index]['follow']['notifications'] == true) {
          emails_sent += 1
          var user = result[index]['follow']['user']
          ajaxWrapper('POST','/api/email/',{'to_email':user['email'], 'from_email':'jeremy.thiesen1@gmail.com', 'subject': this.state.business.name + ' has a new deal for you!', 'text': this.state.business.name + ' just published a new deal for you via Patron Gate. <a href="http://localhost:8000/deal/' + this.props.deal_id + '">' + this.state.name + '</a>'}, console.log)
        }

      }
      this.setState({'emails_sent':true, 'totalEmails': emails_sent})
    }

    publish() {
      if (this.state.published == false) {
        ajaxWrapper('POST','/api/home/deal/' + this.props.deal_id + '/', {'published':true}, () => this.setState({'published':true}))
      }
      ajaxWrapper('GET','/api/home/follow/?related=user&business=' + this.state.business.id,{},this.followCallback)
    }

    remove() {
      ajaxWrapper('POST','/api/home/deal/' + this.props.deal_id + '/', {'published':false}, () => this.setState({'published':false}))
    }

    redeem() {
      var d = new Date();
      var date = [
        d.getFullYear(),
        ('0' + (d.getMonth() + 1)).slice(-2),
        ('0' + d.getDate()).slice(-2)
      ].join('-');

      ajaxWrapper('POST','/api/home/redemption/', {'date':date, 'user':this.props.user_id, 'deal': this.props.deal_id}, this.redeemed);
      ajaxWrapper('POST','/api/email/', {'to_email':this.props.user['email'], 'from_email':'jeremy.thiesen1@gmail.com', 'subject':'Redeemed Coupon: ' + this.state.name + ' via Patron Gate', 'text':this.props.user['first_name'] + ' ' + this.props.user['last_name'] + ' redeemed the coupon ' + this.state.name + ' for ' + this.state.business.name + ' for ' + date}, console.log)
    }

    redeemed(result) {
      window.location.href = '/redeemed/' + result[0]['redemption']['id'] + '/';
    }

    render() {

      var publish = <div></div>
      var emailsSent = <div></div>;
      if (this.props.user_id == this.state.business.owner_id) {
        if (this.state.emailsSent == true) {
          emailsSent = <Alert type={"success"} text={"Emails To " + this.state.totalEmails + " Followers Have Been Sent!"} />
        }
        console.log("You own this business")
        if (this.state.published == false) {
          publish = <Button clickHandler={this.publish} type={'success'} text={'Publish Your Deal On Patron Gate and to all your followers'} />
        }
        else {
          publish = <div>
                      <Button clickHandler={this.remove} type={'danger'} text={'Remove Your Deal From Patron Gate'} />
                      <Button clickHandler={this.publish} type={'success'} text={'Re-publish Your Deal On Patron Gate'} />
                      </div>
        }
      }

      var redeem = <div></div>
      if (this.state.redeemable == true) {
        redeem = <Button clickHandler={this.redeem} type={'success'} text={'Redeem'} />
      }

        var content = <div className="container">
                <h2>{this.state.name}</h2>
                {publish}
                {emailsSent}
                <p>{this.state.description}</p>
                {redeem}
                <Link link={"/business/" + this.state.business.id + "/"} text={this.state.business.name} />
        </div>;


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Deal;
