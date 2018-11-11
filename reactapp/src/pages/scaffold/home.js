import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header} from 'library';
import Deals from '../deals.js';
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true
        };
    }

    setGlobalState() {

    }

    render() {

      var addBusiness = <Button href={"/signUp/business/"} text={"Add Your Business"} type={'patron'} css={{'fontSize':'15px', paddingLeft: '50px', paddingRight:'50px', paddingTop:'15px', paddingBottom: '15px'}} />
      if (this.props.user_id) {
        var addBusiness = <Button href={"/manageYourBusinesses/"} text={"Add Your Business"} type={'patron'} css={{'fontSize':'15px', paddingLeft: '50px', paddingRight:'50px', paddingTop:'15px', paddingBottom: '15px'}} />
      }

      var content =
        <div className=''>
          <MetaTags>
            <title>PatronGate</title>
            <meta name="description" content="Connect With Local Businesses in your Area, Coupons and Deals Finder Based on Your Location." />
            <meta property="og:title" content="PatronGate" />
          </MetaTags>
            <br/>
            <br/>
            <div className="container">
              <h4 style={{'fontWeight':'bold'}}>PatronGate helps you find the best deals around town, let's explore.</h4>
              <Deals user_id={this.props.user_id} limit={3} filters={false} toggleFilters={false} title={false} />
              <Button type={'patron'} text={'See More'} href={'/deals/'} css={{'fontSize':'15px', paddingLeft: '50px', paddingRight:'50px', paddingTop:'15px', paddingBottom: '15px'}} />
              <br />
              <br />
              <br />
              <br />
            </div>

            <div className="container">
              <h4 style={{'fontWeight':'bold'}}>Popular on PatronGate.</h4>
              <Deals user_id={this.props.user_id} limit={12} filters={false} toggleFilters={false} title={false} order_by={'redemptions'}/>
              <Button type={'patron'} text={'See More'} href={'/deals/'} css={{'fontSize':'15px', paddingLeft: '50px', paddingRight:'50px', paddingTop:'15px', paddingBottom: '15px'}} />
              <br />
              <br />
              <br />
              <br />
            </div>

            <div class="feature-callout text-center image-cover" style={{"background-color": "#ffffff"}}>
    					<div class="feature-callout-cover has-overlay" style={{"background-image":"url(/static/images/widget-callout-1.jpg)","background-position": "center center"}}>

    						<div class="container">
    							<div class="row">
    								<div class="col-xs-12  ">
    									<div class="callout-feature-content" style={{"color":"#ffffff"}}>
                        <h2 class="callout-feature-title" style={{"color":"#ffffff"}}>Get Business Exposure</h2>
                        <p>Customers want to connect with your business.  We connect the customers to your business with exclusive deals and offers.  Expand your customer base, and encourage repeat business with your regulars.   PatronGate offers unparalleled value and exposure that most social media companies simply can’t rival.  We can help take your business to the next level.</p>
                        <p><Button href={"/how-it-works/"} text={"How It Works"} type={'patron'} css={{'fontSize':'15px', paddingLeft: '50px', paddingRight:'50px', paddingTop:'15px', paddingBottom: '15px'}} /></p>
                        </div>
    								</div>
    							</div>
    						</div>
    					</div>
    			</div>

          <div class="container">

		<aside id="listify_call_to_action-1" class="home-widget listify_call_to_action">
<div class="call-to-action">

	<div class="container">
		<div class="row">

			<div class="col-sm-12 col-md-8 col-lg-9">
				<h1 class="cta-title" style={{'color':'#717a8f'}}>PatronGate is the best way to Connect with Customers in Your Area</h1>
									<div class="cta-description"><p>Get started today and connect with local customers and allow them to browse your daily specials.</p>
</div>
							</div>

			<div class="cta-button-wrapper col-sm-12 col-md-4 col-lg-3">
			{addBusiness}
				<small class="cta-subtext">
					and get started in minutes</small>
			</div>

		</div>
	</div>
</div>

</aside>
		</div>

        </div>;

        return (
            <Wrapper token={this.props.user_id} loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Home;
