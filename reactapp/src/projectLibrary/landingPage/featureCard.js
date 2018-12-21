import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';


class FeatureCard extends Component {

    render() {

      return (

        <div class="col-md-3 col-sm-4">
          <div style={{textAlign:'center', marginBottom:'45px'}}>
            <img src="/static/images/icon/ss-icon-1.png" alt="" />
            <h4 style={{fontSize:'18px', color:'#424242', padding:'25px 0px 18px 0px', fontWeight:'bold'}}>Cloud Hosting</h4>
            <p style={{lineHeight:'27px', color:'#6b6d6f'}}>There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
          </div>
        </div>

      );
    }
}

export default FeatureCard;
