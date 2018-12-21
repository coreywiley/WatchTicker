import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';
import {Icon} from 'library';;


class TestimonyCard extends Component {

    render() {

      return (

        <div class="col-md-4 col-xs-6">
          <div style={{backgroundColor:'white', padding:'30px'}}>
            <div>
              <div>
                <img src="/static/images/testimonial.png" alt="" />
                <h4 style={{fontSize:'24px', fontWeight:'light',paddingBottom:'10px', paddingTop:"20px"}}>Jonathon Smith</h4>
                <h5 style={{fontSize:'14px'}}>CEO, Hazrat Group</h5>
                <p style={{fontSize:'16px', paddingTop: '30px', paddingBottom:'25px'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
              </div>
            </div>
          </div>
        </div>

      );
    }
}

export default TestimonyCard;
