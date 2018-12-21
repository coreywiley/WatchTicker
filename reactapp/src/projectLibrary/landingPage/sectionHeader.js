import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

class PricingSection extends Component {

    render() {


      return (
        <div style={{paddingBottom:'60px', textAlign:'center'}}>
            <h2 style={{fontSize:'35px', color:this.props.color,  paddingBottom:'20px', fontWeight:'lighter'}}>{this.props.title}</h2>
            <div style={{height:'2px', width:'60px', backgroundColor: this.props.color, display:'block',margin:'auto', marginBottom:'40px'}}></div>
            <p style={{maxWidth:'555px', margin:'auto', fontSize:'14px', color:this.props.color, letterSpacing:'.28px'}}>{this.props.description}</p>
        </div>
      );
    }
}

export default PricingSection;
