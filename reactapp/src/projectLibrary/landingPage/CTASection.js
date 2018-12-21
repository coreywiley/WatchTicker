import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';
import SectionHeader from './sectionHeader.js';
import {Section, Container} from 'library';

class CTASection extends Component {

    render() {


      return (
        <Section style={{paddingTop:'100px', paddingBottom:'100px', backgroundColor:'#F97300'}}>
          <Container>

            <div style={{textAlign:'center'}}>
                <SectionHeader title={'For A Limited Time Get Free 30 Day Access'} description={"Because why wouldn't you get something for free."} color={'white'}/>

                <p className="btn" style={{backgroundColor:'white', color:'#F97300', padding:'10px', width:'40%', fontSize:'25px', fontWeight:'bold'}}>Sign Up</p>

            </div>

          </Container>
        </Section>
      );
    }
}

export default CTASection;
