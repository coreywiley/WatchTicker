import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';
import SectionHeader from './sectionHeader.js';
import TestimonyCard from './testimonyCard.js';
import {Section, Container} from 'library';

class TestimonialSection extends Component {

    render() {

      return (
        <Section style={{paddingTop:'100px', paddingBottom:'100px', backgroundColor:'#F97300'}}>
          <Container>
            <div style={{textAlign:'center'}}>
                <SectionHeader title={'What Our Client Say About Us'} description={""} color={'white'}/>
                <div className="row">
                  <TestimonyCard />
                  <TestimonyCard />
                  <TestimonyCard />
                </div>

            </div>

          </Container>
        </Section>
      );
    }
}

export default TestimonialSection;
