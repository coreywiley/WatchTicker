import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';
import FeatureCard from './featureCard.js';
import SectionHeader from './sectionHeader.js';

import {Section, Container} from 'library';

class FeaturesSection extends Component {

    render() {
      var featureCards = []
      for (var i = 0; i < 8; i++) {
        featureCards.push(<FeatureCard />)
      }
      console.log("Feature Cards", featureCards)

      return (
        <Section>
          <Container>
            <SectionHeader title={'Our Service'} description={"Everything you need to build and share your business's online presence."} color={'#424242'}/>

            <div className="row">
              {featureCards}
            </div>

          </Container>
        </Section>
      );
    }
}

export default FeaturesSection;
