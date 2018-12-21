import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';
import {Icon} from 'library';;


class FeatureCard extends Component {

    render() {

      return (

        <div class="col-md-3 col-xs-6">
            <div class="pricing-item price_item2" style={{backgroundColor:'#fff', padding:'50px 30px', textAlign:'center'}}>
                <h2 style={{fontFamily:'Montserrat', fontSize:'24px', color:'#424242', letterSpacing:'.48px', marginBottom:'28px', fontWeight:'lighter'}}>BASIC</h2>
                <h3 style={{fontFamily:'Montserrat', fontSize:'28px', color:this.props.color, lineHeight:'26px', fontWeight:'bold'}}>
                  $20 / <sub style={{fontWeight:400, fontSize:'14px'}}>month</sub>
                </h3>
                <ul style={{listStyle:'none', margin:'0px', padding:'0px', marginTop:'40px', textAlign:'left'}}>
                    <li style={{'fontFamily':'Poppins', fontSize:'14px', color:'#6b6d6f'}}><Icon size={1} icon={'check-circle-o'} style={{color:this.props.color, marginRight:'10px'}}/>  Free Useable</li>
                    <li style={{'fontFamily':'Poppins', fontSize:'14px', color:'#6b6d6f'}}><Icon size={1} icon={'check-circle-o'} style={{color:this.props.color, marginRight:'10px'}} />  Free Useable</li>
                    <li style={{'fontFamily':'Poppins', fontSize:'14px', color:'#6b6d6f'}}><Icon size={1} icon={'check-circle-o'} style={{color:this.props.color, marginRight:'10px'}} />  Free Useable</li>
                    <li style={{'fontFamily':'Poppins', fontSize:'14px', color:'#6b6d6f'}}><Icon size={1} icon={'check-circle-o'} style={{color:this.props.color, marginRight:'10px'}} />  Free Useable</li>
                </ul>
                <a href="#" className="btn" style={{backgroundColor:this.props.color, color:'white', font:'bold', fontFamily:'Montserrat', padding:'6px 29px', marginTop:'30px'}}>Purchase Now</a>
            </div>
        </div>

      );
    }
}

export default FeatureCard;
