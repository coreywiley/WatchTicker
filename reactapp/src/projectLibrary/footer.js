import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar} from 'library';
import settings from 'base/settings.js';

class Footer extends React.Component {
    constructor(props) {
      super(props);
      var date = new Date();
      var year = date.getYear() + 1900;
      this.state = {'year': year}
    }

    render() {
        return (
          <footer className="footer_three_area" style={{backgroundColor:'#F97300', paddingTop:'100px'}}>
            	<div className="container">
            		<div className="footer_widget_inner">
            			<div className="row">
            				<div className="col-md-4 col-xs-6">
            					<aside className="f_three_widget ab_ft_widget">
            						<h3 style={{color:'white'}}>{settings.WEBSITE_NAME}</h3>
            						<p style={{color:'white'}}>If you are going to use a passage of Lorem Ipsum, you need to be sure</p>
            						<ul style={{listStyle:'none'}}>
            							<li style={{marginRight:'20px', display:'inline-block'}}><i className="fa fa-facebook"></i></li>
            							<li style={{marginRight:'20px', display:'inline-block'}}><i className="fa fa-twitter"></i></li>
            							<li style={{marginRight:'20px', display:'inline-block'}}><i className="fa fa-google-plus"></i></li>
            							<li style={{marginRight:'20px', display:'inline-block'}}><i className="fa fa-linkedin"></i></li>
            						</ul>
            					</aside>
            				</div>
            				<div className="col-md-2 col-xs-3">
            					<aside className="f_three_widget link_ft_widget">
            						<div className="ft_title">
            							<h3 style={{color:'white'}}>News</h3>
            						</div>
            						<ul style={{listStyle:'none', padding:'0px'}}>
            							<li><a href="#" style={{color:'white'}}>Subsciption</a></li>
            							<li><a href="#" style={{color:'white'}}>New Apps</a></li>
            							<li><a href="#" style={{color:'white'}}>Download now</a></li>
            						</ul>
            					</aside>
            				</div>
            				<div className="col-md-2 col-xs-3">
            					<aside className="f_three_widget link_ft_widget">
            						<div className="ft_title">
            							<h3 style={{color:'white'}}>Company</h3>
            						</div>
            						<ul style={{listStyle:'none', padding:'0px'}}>
            							<li><a href="#" style={{color:'white'}}>Screenshot</a></li>
            							<li><a href="#" style={{color:'white'}}>Fetures</a></li>
            							<li><a href="#" style={{color:'white'}}>Price</a></li>
            						</ul>
            					</aside>
            				</div>
            				<div className="col-md-2 col-xs-3">
            					<aside className="f_three_widget link_ft_widget">
            						<div className="ft_title">
            							<h3 style={{color:'white', padding:'0px'}}>Resources</h3>
            						</div>
            						<ul style={{listStyle:'none', padding:'0px'}}>
            							<li><a href="#" style={{color:'white'}}>Support</a></li>
            							<li><a href="#" style={{color:'white'}}>Contact</a></li>
            							<li><a href="#" style={{color:'white'}}>Privacy &amp; term</a></li>
            						</ul>
            					</aside>
            				</div>
            				<div className="col-md-2 col-xs-3">
            					<aside className="f_three_widget link_ft_widget">
            						<div className="ft_title">
            							<h3 style={{color:'white'}}>Solutions</h3>
            						</div>
            						<ul style={{listStyle:'none', padding:'0px'}}>
            							<li><a href="#" style={{color:'white'}}>Bug fixing</a></li>
            							<li><a href="#" style={{color:'white'}}>Upgrade</a></li>
            							<li><a href="#" style={{color:'white'}}>Malware protect</a></li>
            						</ul>
            					</aside>
            				</div>
            			</div>
            		</div>
            		<div className="ft_copyright">
            			<div className="container">
            				<p className="copyright" style={{color:'white', borderTop:'1px solid #c15a00', paddingTop:'40px', paddingBottom:'40px', textAlign:'center'}}>
                      Copyright ©{this.state.year} All Rights Reserved
                    </p>
            			</div>
            		</div>
            	</div>
            </footer>
        );
    }
}


export default Footer;
