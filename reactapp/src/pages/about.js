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
      var content =
      <div>
      <MetaTags>
        <title>About</title>
        <meta name="description" content="About on PatronGate | You're hungry and we're here to help ..." />
        <meta property="og:title" content="About" />
      </MetaTags>
      <div class="page-cover page-cover--default">
  		<h1 class="page-title cover-wrapper" style={{'fontWeight':'bold', fontSize: '30px'}}>
  		About</h1>
  	</div>
      <div class="entry-content container" style={{'fontSize':'20px', marginTop:'30px'}}>
      <p>
      You’re hungry and we’re here to help! In fact, helping others find the food they love is how we got our start. While searching for a Friday night fish fry deal we were inundated with google results and reviews. We thought, there must be a better way to get better results, and so the idea of PatronGate.com was born.
      </p>
      <p>
      We make it quick and easy for you to find exactly the type of food you’re looking for in the exact place you happen to be looking. And better yet, the restaurants that you find listed on our site are offering the biggest and best deals and coupons to our customers. And unlike other sites, we won’t bog you down by making recommendations. You know what you want to eat, we don’t!
      </p>
      <p>
      We just focus on food and drinks, so you won’t be bombarded with a ton of other offers when all you want to do is get something delicious to eat or drink. There are no certificates to buy, just good deals and many choices to satisfy your hunger.
      </p>
      <p>
      From restaurants to bars and even food trucks, we’ve got you covered. Our site was created for food lovers by food lovers so whether you’re planning a big night out or just want to grab a quick bite, we are here to help you find that perfect meal and get a deal!
      </p>
      </div>
      </div>

        return (
            <Wrapper token={this.props.user_id} loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Home;
