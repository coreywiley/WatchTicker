import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import MetaTags from 'react-meta-tags';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Alert} from 'library';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            contact: {
            email:'',
            subject:'',
            message:''
          },
          sent:false,
        };

        this.send = this.send.bind(this);
        this.sent = this.sent.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);
    }

    setGlobalState(name, value) {
      this.setState({contact:value})
    }

    send() {
      ajaxWrapper('POST','/api/email/', {'to_email':'patrongate@gmail.com', 'from_email': 'patrongate@gmail.com', 'subject':'Contact From Patrongate: ' + this.state.contact.subject, 'text':this.state.contact.message + '<br/><br/><p>Sent From: ' + this.state.contact.email + '</p>'}, this.sent)
    }

    sent(result) {
      this.setState({sent:true})
    }

    render() {

      var Components = [TextInput, TextInput, TextArea];
      var email = {'value':'','name':'email','label':'Email','placeholder': 'you@you.com', 'required':true}
      var subject = {'value':'', 'name':'subject', 'label':'Subject', 'placeholder': 'I Want To...', 'required':true}
      var message = {'value':'','name':'message','label':'Message','placeholder': 'Hi! I was wondering...'}
      var ComponentProps = [email, subject, message];
      var defaults = this.state.contact;

      var sent = <div></div>
      if (this.state.sent == true) {
        sent = <Alert type={'success'} text={'Email Sent.'} />
      }

      var content =
      <div>
      <MetaTags>
        <title>Contact</title>
        <meta name="description" content="About on PatronGate | You're hungry and we're here to help ..." />
        <meta property="og:title" content="Contact" />
      </MetaTags>
      <div class="page-cover page-cover--default">
    		<h1 class="page-title cover-wrapper" style={{'fontWeight':'bold', fontSize: '30px'}}>
    		Contact Us</h1>
    	</div>
      <div className="container">
              <Form components={Components} setGlobalState={this.setGlobalState} autoSetGlobalState={true} globalStateName={'contact'} componentProps={ComponentProps} defaults={defaults} />
              <Button type={'patron'} text={'Send'} clickHandler={this.send} css={{'fontSize':'15px', paddingLeft: '50px', paddingRight:'50px', paddingTop:'10px', paddingBottom: '10px'}} />
              {sent}
              <br/>
              <br/>
      </div>



      </div>

        return (
            <Wrapper token={this.props.user_id} loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Home;
