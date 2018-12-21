import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';
import HeaderSection from './headerSection.js';
import FeaturesSection from './featuresSection.js';
import CTASection from './CTASection.js';
import PricingSection from './pricingSection.js';
import TestimonialSection from './testimonialSection.js';
import ContactSection from './contactSection.js';

class Home extends Component {

    render() {
      var content = <div>
        <HeaderSection />
        <FeaturesSection />
        <CTASection />
        <PricingSection />
        <TestimonialSection />
        <ContactSection />
    </div>

        return (
            <Wrapper loaded={true} content={content} />
        );
    }
}

export default Home;
