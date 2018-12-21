import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';
import SectionHeader from './sectionHeader.js';
import {Section, Container} from 'library';

class ContactSection extends Component {

    render() {


      return (
        <Section>
          <Container>
            	<SectionHeader title={'Contact Us'} color={'#424242'} />

            		<div class="contact_six_inner">
            			<form class="contact_six_form row" action="contact_process.php" method="post" id="contactForm" novalidate="novalidate">
      							<div class="form-group col-md-12">
      								<input type="text" class="form-control" id="name" name="name" placeholder="Full Name" />
      							</div>
      							<div class="form-group col-md-12">
      								<input type="email" class="form-control" id="email" name="email" placeholder="Your Email / Phone Number" />
      							</div>
      							<div class="form-group col-md-12">
      								<input type="text" class="form-control" id="subject" name="subject" placeholder="Subject" />
      							</div>
      							<div class="form-group col-md-12">
      								<textarea class="form-control" name="message" id="message" rows="1" placeholder="Your Message"></textarea>
      							</div>
      							<div class="form-group col-md-12">
      								<button class="btn btn-outline-secondary btn-lg" style={{backgroundColor:'#F97300', color:'white', borderColor:'#F97300'}}>Send</button>
      							</div>
      						</form>
            	</div>
              </Container>
            </Section>
      );
    }
}

export default ContactSection;
