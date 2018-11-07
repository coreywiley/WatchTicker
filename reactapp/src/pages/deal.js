import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, TextArea, Link, Button, Alert, MultiLineText, PageBreak} from 'library';

class Deal extends Component {
    constructor(props) {
      super(props);
      this.state = {'business':{'name':'', 'id':0}, 'name':'','description':'', 'published':false, 'emails_sent':false, 'redeemable':true, 'totalRedemptions':0, 'number_of_redeems_available':0, 'newPublish':false};

      this.dealCallback = this.dealCallback.bind(this);
      this.publish = this.publish.bind(this);
      this.remove = this.remove.bind(this);
      this.followCallback = this.followCallback.bind(this);
      this.redeem = this.redeem.bind(this);
      this.redeemed = this.redeemed.bind(this);
      this.redemptionNumber = this.redemptionNumber.bind(this);
      this.redirect = this.redirect.bind(this);
    }

    componentDidMount() {
        ajaxWrapper('GET','/api/home/deal/' + this.props.deal_id + '/?related=business', {}, this.dealCallback)
    }

    checkIfRedeemable(deal) {
      //is date past due
      if (deal.valid_until) {
        var d = new Date()
        var valid_until = new Date(deal.valid_until)
        if (d > valid_until) {
          this.setState({redeemable: false})
        }
      }
        ajaxWrapper('GET','/api/home/redemption/?count&user=' + this.props.user_id + '&deal=' + this.props.deal_id, {}, this.redemptionNumber)
    }

    redemptionNumber(result) {
      var totalRedemptions = result['count'];

      if (totalRedemptions >= this.state.number_of_redeems_available && this.state.number_of_redeems_available > 0) {
        this.setState({totalRedemptions:result['count'], redeemable:false})
      }
      else {
        this.setState({totalRedemptions:result['count']})
      }
    }

    dealCallback(result) {
      var deal = result[0]['deal']
      deal['loaded'] = true
      this.setState(deal, () => this.checkIfRedeemable(deal))
    }

    followCallback(result) {
      var emails_sent = 0;
      for (var index in result) {
        if (result[index]['follow']['notifications'] == true) {
          emails_sent += 1
          var user = result[index]['follow']['user']
          ajaxWrapper('POST','/api/email/',{'to_email':user['email'], 'from_email':'patrongate@gmail.com', 'subject': this.state.business.name + ' has a new deal for you!', 'text': this.state.business.name + ' just published a new deal for you via Patron Gate. <a href="http://patrongate.jthiesen1.webfactional.com/deal/' + this.props.deal_id + '">' + this.state.name + '</a>'}, console.log)
        }

      }
      this.setState({'emails_sent':true, 'totalEmails': emails_sent})
    }

    publish() {
      if (this.state.published == false) {
        ajaxWrapper('GET','/api/home/follow/?related=user&business=' + this.state.business.id,{},this.followCallback)
      }
      var d = new Date();
      var date = [
        d.getFullYear(),
        ('0' + (d.getMonth() + 1)).slice(-2),
        ('0' + d.getDate()).slice(-2)
      ].join('-') + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

      ajaxWrapper('POST','/api/home/deal/' + this.props.deal_id + '/', {'published':true, 'last_published': date}, () => this.setState({'published':true, 'newPublish':true}))

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
    }

    redeemed(result) {
      var d = new Date();
      var date = [
        d.getFullYear(),
        ('0' + (d.getMonth() + 1)).slice(-2),
        ('0' + d.getDate()).slice(-2)
      ].join('-');

      var file_name = this.props.user['id'] + '_' + result[0]['redemption']['id'] + '.jpg';
      console.log({'file_name': file_name, 'main_image':this.state.main_image, 'text': this.props.user['first_name'] + ' redeemed \n' + this.state.name + '\n on ' + date + '\n via PatronGate'})
      ajaxWrapper('POST','/redeem/',{'file_name': file_name, 'main_image':this.state.main_image, 'text': this.props.user['first_name'] + ' redeemed \n' + this.state.name + '\n on ' + date + '\n via PatronGate'}, console.log)
      ajaxWrapper('POST','/api/email/', {'to_email':this.props.user['email'], 'from_email':'patrongate@gmail.com', 'subject':'Redeemed Coupon: ' + this.state.name + ' via Patron Gate', 'text':"<img src='http://patrongate.jthiesen1.webfactional.com/static/images/" + file_name + "'>"}, () => this.redirect(result[0]['redemption']['id']))
    }

    redirect(id) {
        window.location.href = '/redeemed/' + id + '/';
    }

    render() {

      var publish = <div></div>
      var emailsSent = <div></div>;
      if (this.props.user_id == this.state.business.owner_id || this.props.user.is_staff == true) {
        if (this.state.emailsSent == true) {
          emailsSent = <Alert type={"success"} text={"Emails To " + this.state.totalEmails + " Followers Have Been Sent!"} />
        }
        if (this.state.published == false) {
          publish = <div style={{'padding':'10px'}}><br/>
            <div style={{'float':'left'}}><Button clickHandler={this.publish} type={'success'} text={'Publish Your Deal On Patron Gate and to all your followers'} /></div>
            <div style={{'float':'right'}}><Button href={"/dealForm/" + this.state.business.id + "/" + this.props.deal_id + "/"} type={'primary'} text={'Edit Deal'} /></div><br/>
          </div>
        }
        else {
          publish = <div><br/>
                      <div style={{'float':'left'}}>
                        <Button clickHandler={this.remove} type={'danger'} text={'Remove Your Deal From Patron Gate'} />
                        <Button clickHandler={this.publish} type={'success'} text={'Re-publish Your Deal On Patron Gate'} />
                      </div>
                      <div style={{'float':'right'}}><Button href={"/dealForm/" + this.state.business.id + "/" + this.props.deal_id + "/"} type={'primary'} text={'Edit Deal'} /></div><br/>
                    </div>
        }
      }

      var newPublish = <div></div>
      if (this.state.newPublish == true) {
        newPublish = <Alert text={'You just published your deal!'} type={'success'} />
      }
      else if (this.state.published == false) {
        newPublish = <Alert text={"Your deal isn't published yet."} type={'danger'} />
      }

      var redeem = <div></div>
      if (this.props.user_id) {
        if (this.state.redeemable) {
          redeem = <div><Button clickHandler={this.redeem} css={{'width':'100%'}} type={'patron'} text={'Redeem'} /><p><strong>When clicking redeem, you are redeeming the coupon for use today. It will be invalid after today</strong></p></div>
        }
        else {
          redeem = <div><Button clickHandler={console.log} css={{'width':'100%'}} type={'patron'} text={'Cannot Redeem'} disabled={true} /><p><strong>When clicking redeem, you are redeeming the coupon for use today. It will be invalid after today</strong></p></div>
        }


      }
      else {
        redeem = <Button href={'/signUp/'} type={'success'} css={{'width':'100%'}} text={'Sign Up To Redeem'} />
      }

      var number_of_redeems_available = <p style={{'margin':'0px'}}>This deal can be redeemed a total of {this.state.number_of_redeems_available} times.</p>
      if (this.state.number_of_redeems_available == 0) {
        number_of_redeems_available = <p style={{'margin':'0px'}}>This deal can be redeemed unlimited times.</p>
      }

      var valid_until = <div></div>
      if (this.state.valid_until != null) {
        valid_until = <p style={{'margin':'0px'}}>Valid Until: {this.state.valid_until}</p>
      }


        var content = <div className="container">
        <MetaTags>
          <title>{this.state.name} with {this.state.business.name}| PatronGate</title>
          <meta name="description" content={this.state.name + ' with ' + this.state.business.name + '| PatronGate'} />
          <meta property="og:title" content={this.state.name + ' with ' + this.state.business.name + '| PatronGate'} />
        </MetaTags>

                <div className='row'>
                  <div className='col-md-12'>
                  <div>
                  {publish}
                  </div>
                    <h1 style={{'margin':'0px'}}><a style={{'color':'#234f9c'}} href={"/business/" + this.state.business.id + "/"}>{this.state.business.name}</a></h1>
                    <p style={{'color':'#666','margin':'0px'}}>{this.state.business.city}, {this.state.business.state}</p>
                    <p style={{'margin':'1px'}}><i class="fas fa-tag"></i> {this.state.name} at <a style={{'color':'#234f9c'}} href={"/business/" + this.state.business.id + "/"}>{this.state.business.name}</a></p>
                  </div>
                  <div className='col-md-8' style={{'paddingRight':'10px', 'borderRight':'1px solid #ccc'}}>

                    <div>
                    {newPublish}
                    {emailsSent}
                    </div>

                    <img src={this.state.main_image} style={{'width':'100%'}} />
                    <br/>
                    <h3 style={{'marginTop':'20px', 'marginBottom':'2px'}}>Highlights</h3>
                    <PageBreak />
                    <br/>
                    <MultiLineText text={this.state.description} />
                    <br/>
                    <h3 style={{'marginTop':'20px', 'marginBottom':'2px'}}>About <a style={{'color':'#234f9c'}} href={"/business/" + this.state.business.id + "/"}>{this.state.business.name}</a></h3>
                    <PageBreak />
                    <br/>
                    <MultiLineText text={this.state.business.description} />
                    <br/>
                    <iframe src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyDnsYmrV7t2Bx5DH0NFcb5eSFR-Ii4kMb4&q=" + this.state.business.address} width="800" height="600" frameborder="0" style={{'border':'0'}} allowfullscreen></iframe>
                  </div>
                  <div className='col-md-4' style={{'paddingLeft':'10px'}}>
                    <div id="coupon">
                      <h4 style={{'margin':'0px'}}>{this.state.name}</h4>
                      {number_of_redeems_available}
                      {valid_until}
                      <p>You have redeemed this coupon {this.state.totalRedemptions} times.</p>

                      {redeem}
                    </div>
                  </div>
                </div>

        </div>;


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Deal;
