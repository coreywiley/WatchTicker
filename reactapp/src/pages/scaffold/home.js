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
      var content =
        <div className=''>
          <MetaTags>
            <title>PatronGate</title>
            <meta name="description" content="Connect With Local Businesses in your Area, Coupons and Deals Finder Based on Your Location." />
            <meta property="og:title" content="PatronGate" />
          </MetaTags>
            <div style={{textAlign:"center"}}>
              <div style={{'background-image': 'url(http://beta.patrongate.com/wp-content/uploads/2018/07/roof.jpg)'}} class="homepage-cover page-cover entry-cover entry-cover--home entry-cover--solid has-image">
                <div class="cover-wrapper container">
                  <div class="listify_widget_search_listings">
                    <div class="home-widget-section-title">
                      <h1 class="home-widget-title" style={{'fontSize':'45px', 'fontWeight':'bold'}}>Explore Local Businesses</h1>
                      <p class="home-widget-description">PatronGate helps you find food and drink specials in your city, Lets explore.</p>
                    </div>
                    <div class="search-filters-home">
                      <div class="job_search_form job_search_form--count-2">
                        <Button href={'/businesses/'} text={"Search"} type={'patron'} css={{'fontSize':'15px', paddingLeft: '50px', paddingRight:'50px'}} />
                      </div>
                    </div>
          				</div>
                </div>
                </div>

            </div>
            <br/>
            <br/>
            <br/>
            <div style={{textAlign:"center"}}>
              <Deals user_id={this.props.user_id} limit={6} />
              <Button type={'patron'} text={'See More'} href={'/deals/'} css={{'fontSize':'15px', paddingLeft: '50px', paddingRight:'50px', paddingTop:'15px', paddingBottom: '15px'}} />
              <br />
              <br />
              <br />
              <br />
            </div>
            <div class="feature-callout text-center image-cover" style={{"background-color": "#ffffff"}}>
    					<div class="feature-callout-cover has-overlay" style={{"background-image":"url(http://beta.patrongate.com/wp-content/uploads/2018/01/widget-callout-1.jpg)","background-position": "center center"}}>

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
			<Button href={"/add-your-listing/"} text={"Add Your Business"} type={'patron'} css={{'fontSize':'15px', paddingLeft: '50px', paddingRight:'50px', paddingTop:'15px', paddingBottom: '15px'}} />
				<small class="cta-subtext">
					and get started in minutes				</small>
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
