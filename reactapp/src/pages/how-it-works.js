import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header} from 'library';

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

      var addListingLink = '/signUp/business/';
      if (this.props.user.id) {
        addListingLink = "/manageYourBusinesses/"
      }

      var content =
      <div>
      <MetaTags>
        <title>How It Works</title>
        <meta name="description" content="How it Works on PatronGate | PatronGate offers a simple way ..." />
        <meta property="og:title" content="How It Works" />
      </MetaTags>
  		<h1 class="page-title cover-wrapper" style={{'fontWeight':'bold', fontSize: '30px'}}>
  		How it Works</h1>
      <div class="entry-content container" style={{'fontSize':'20px', marginTop:'30px'}}>
          <p>PatronGate offers a simple way to connect with potential customers in your neighborhood, allowing you to take a step back from marketing your business so you can focus on your service or products. Elegant, simple and easy to use, PatronGate offers a way to generate revenue without the headaches.</p>
          <p style={{"text-align": "center"}}><i style={{'color':' #234f9c'}} class="fa fa-check-square-o" aria-hidden="true"></i> 1. Submit Your Listing to Create an Account</p>
          <p><img class="size-full aligncenter" src="/static/images/page-how-it-works-3.png" width="220px" /><br />
          Visit our '<a href={addListingLink}>add your business listing</a>' page and enter your information. Our representatives will follow up to confirm your information is correct and you are indeed the owner of the business.</p>
          <p>Add information such as photos, physical address, business hours, and links to your social media accounts.</p>
          <p>Our premium members have access to our coupon creation services.&nbsp; Allowing you to connect with thousands of new and already existing customers in your area, to offer deals and specials exclusive to PatronGate.</p>
          <p>&nbsp;</p>
          <p style={{"text-align": "center"}}><i style={{'color':' #234f9c'}} class="fa fa-check-square-o" aria-hidden="true"></i> 2. Get More Interest In Your Place</p>
          <p><img class="size-full aligncenter" src="/static/images/page-how-it-works-1.png" width="180px" /></p>
          <h3></h3>
          <p>With PatronGate we offer a full range of services to enable you to connect with your existing customers, and also connect with thousands of potential new customers.&nbsp; Add deals of the week, coupons and exclusive offers that are only available through PatronGate.</p>
          <p>&nbsp;</p>
          <div style={{'text-align':'center'}}>
            <Button type={'patron'} href={addListingLink} text={"Get Started Now"} css={{'fontSize':'15px', paddingLeft: '50px', paddingRight:'50px', paddingTop:'15px', paddingBottom: '15px', marginBottom:'30px'}} />
          </div>
      </div>
      </div>

        return (
            <Wrapper token={this.props.user_id} loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Home;
