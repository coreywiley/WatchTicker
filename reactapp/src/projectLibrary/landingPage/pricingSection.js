import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';
import SectionHeader from './sectionHeader.js';
import PriceCard from './priceCard.js';

import {Icon} from 'library';
import {Section, Container} from 'library';

class PricingSection extends Component {

    render() {


      return (
        <Section style={{'paddingTop':'100px','paddingBottom':'100px', backgroundColor:'#f9faff'}}>
            <Container>

                <SectionHeader title={'Pricing'} description={"Competitive pricing with a better service."} color={'#424242'}/>

                <div class="row">
                    <PriceCard color={'#3498db'}/>
                    <PriceCard color={'#3498db'} />
                    <PriceCard color={'#F97300'} />
                    <PriceCard color={'#3498db'} />

                </div>
            </Container>
        </Section>
      );
    }
}

export default PricingSection;
