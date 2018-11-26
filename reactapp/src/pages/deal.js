import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, TextArea, Link, Button, Alert, MultiLineText, PageBreak, Stars} from 'library';

import Review from 'projectLibrary/review.js';
import ReviewForm from 'projectLibrary/reviewForm.js';

class Deal extends Component {
    constructor(props) {
      super(props);
      this.state = {'business':{'name':'', 'id':0}, 'name':'','description':'', 'published':false, 'emails_sent':false, 'redeemable':true, 'totalRedemptions':0, 'number_of_redeems_available':0, 'overallTotalRedemptions':0, 'number_of_total_redeems_available':0, 'newPublish':false};

      this.dealCallback = this.dealCallback.bind(this);
      this.publish = this.publish.bind(this);
      this.remove = this.remove.bind(this);
      this.followCallback = this.followCallback.bind(this);
      this.redeem = this.redeem.bind(this);
      this.redeemed = this.redeemed.bind(this);
      this.redemptionNumber = this.redemptionNumber.bind(this);
      this.totalRedemptionNumber = this.totalRedemptionNumber.bind(this);
      this.redirect = this.redirect.bind(this);
      this.getDeal = this.getDeal.bind(this);
    }

    getDeal() {
      ajaxWrapper('GET','/api/home/deal/' + this.props.deal_id + '/?related=business,business__review,business__review__user', {}, this.dealCallback)
    }

    componentDidMount() {
        this.getDeal();
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
        ajaxWrapper('GET','/api/home/redemption/?count&deal=' + this.props.deal_id, {}, this.totalRedemptionNumber)
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

    totalRedemptionNumber(result) {
      var totalRedemptions = result['count'];
      console.log("Total Redemptions", totalRedemptions);

      if (totalRedemptions >= this.state.number_of_total_redeems_available && this.state.number_of_total_redeems_available > 0) {
        this.setState({overallTotalRedemptions:result['count'], redeemable:false})
      }
      else {
        this.setState({overallTotalRedemptions:result['count']})
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

      if (this.state.ad) {
        redeem = <div><Button css={{'width':'100%'}} type={'patron'} text={'Redeem In Store Only'} disabled={true} /><p><strong>This deal is available in the store to anyone who comes in person.</strong></p></div>
      }
      else {
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
      }

      var number_of_redeems_available = <p style={{'margin':'0px'}}>You can redeem this deal a total of {this.state.number_of_redeems_available} times.</p>
      if (this.state.number_of_redeems_available == 0) {
        number_of_redeems_available = <p style={{'margin':'0px'}}>You can redeem this deal unlimited times.</p>
      }

      var valid_until = <div></div>
      if (this.state.valid_until != null) {
        valid_until = <p style={{'margin':'0px'}}>Valid Until: {this.state.valid_until}</p>
      }

      var reviews = [];
      if (this.state.business.review && this.state.business.review.length == 0) {
        reviews = <p>There are no reviews yet.</p>
      }
      else {
        for (var index in this.state.business.review) {
          var review = this.state.business.review[index]['review']
          reviews.push(<Review {...review} />)
        }
      }

      var askForReview = <p>Please Sign Up and Redeem A Coupon Before Writing A Review.</p>
      if (this.state.totalRedemptions > 0 && this.props.user.id) {
        var reviewed = false;
        for (var index in this.state.business.review) {
          if (this.state.business.review[index]['review']['user']['id'] == this.props.user.id) {
            reviewed = true;
          }
        }

        if (reviewed) {
          var askForReview = <p>You've already left a review.</p>
        }
        else {
          askForReview = <ReviewForm user={this.props.user.id} business={this.state.business.id} refreshData={this.getDeal} />
        }

      }


      var titles = <div>
      <div>
      {publish}
      </div>
        <h1 style={{'margin':'0px'}}><a style={{'color':'#234f9c'}} href={"/business/" + this.state.business.id + "/"}>{this.state.business.name}</a></h1>
        <p style={{'color':'#666','margin':'0px'}}>{this.state.business.city}, {this.state.business.state}</p>
        <p style={{'margin':'1px'}}><i class="fas fa-tag"></i> {this.state.name} at <a style={{'color':'#234f9c'}} href={"/business/" + this.state.business.id + "/"}>{this.state.business.name}</a></p>

        <div>
        {newPublish}
        {emailsSent}
        </div>
      </div>

      var dealInfo = <div>

        <img src={this.state.main_image} style={{'width':'100%'}} />
        <br/>
        <div style={{'padding':'15px'}}>
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

        <h3 style={{'marginTop':'20px', 'marginBottom':'2px'}}>Customer Reviews</h3>
        <PageBreak />
        <br/>
        {askForReview}
        {reviews}

        <br/>
        <h3 style={{'marginTop':'20px', 'marginBottom':'2px'}}>The Fine Print</h3>
        <PageBreak />
        <br/>
        <MultiLineText text={this.state.fine_print} />
        <br/>

        <iframe src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyDnsYmrV7t2Bx5DH0NFcb5eSFR-Ii4kMb4&q=" + this.state.business.address} width="800" height="600" frameborder="0" style={{'border':'0'}} allowfullscreen></iframe>

        <br/>
        <h3 style={{'marginTop':'20px', 'marginBottom':'2px'}}>What You'll Get</h3>
        <PageBreak />
        <br/>
        <MultiLineText text={this.state.what_you_get} />
        </div>
        </div>;


        if (this.state.ad) {
          var couponInfo = <div>
          <h4 style={{'margin':'0px'}}>{this.state.name}</h4>
          {valid_until}

          {redeem}
          </div>
        }
        else {
          var couponInfo = <div>
          <h4 style={{'margin':'0px'}}>{this.state.name}</h4>
          <p style={{'margin':'0px'}}>This deal has been redeemed {this.state.overallTotalRedemptions} times.</p>
          {number_of_redeems_available}
          {valid_until}
          <p>You have redeemed this coupon {this.state.totalRedemptions} times.</p>

          {redeem}
          </div>
        }

        var meta = <MetaTags>
          <title>{this.state.name} with {this.state.business.name}| PatronGate</title>
          <meta name="description" content={this.state.name + ' with ' + this.state.business.name + '| PatronGate'} />
          <meta property="og:title" content={this.state.name + ' with ' + this.state.business.name + '| PatronGate'} />
        </MetaTags>

      if (isMobile) {
        var content = <div className="container-fluid" style={{'padding':'0px'}}>
                  {meta}
                  <div  style={{'padding':'15px'}}>
                  {titles}
                  </div>
                  {dealInfo}

                    <div style={{'position':'fixed','bottom':'0px', backgroundColor:'white', 'zIndex':100, 'left':'0px','width':'100%', 'padding':'10px'}}>
                      {couponInfo}
                  </div>
        </div>;
      }
      else {
        var content = <div className="container">
                  {meta}
                <div className='row'>
                  <div className='col-md-12'>
                    {titles}
                  </div>

                  <div className='col-md-8' style={{'paddingRight':'10px', 'borderRight':'1px solid #ccc'}}>
                    {dealInfo}
                  </div>
                  <div className='col-md-4' style={{'paddingLeft':'10px'}}>
                    <div id="coupon">
                      {couponInfo}
                    </div>
                  </div>
                </div>

        </div>;
      }



        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Deal;
