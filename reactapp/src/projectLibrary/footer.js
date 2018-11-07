import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar} from 'library';

class Footer extends React.Component {


    render() {
        return (
          <div className="footer-wrapper">
            <footer className="site-footer-widgets" style={{'backgroundColor':'#2854a1'}}>
              <div className="container">
                <div className="row">
                  <div className="footer-widget-column col-xs-12 col-sm-12 col-lg-5">
                    <aside id="text-1" className="footer-widget widget_text">
                      <div className="textwidget">
                        <img src="/static/images/pg_v3.png" style={{'width': '159px', 'marginBottom': '1em'}} />
                        <p>At PatronGate our purpose is to connect people with great local businesses.  Discover and search for exclusive deals on meals, drink specials, and more!</p>
                        <p>Made in the USA</p>
                        <p></p>
                      </div>
                    </aside>
                  </div>
                  <div className="footer-widget-column col-xs-12 col-sm-6 col-lg-3 col-lg-offset-1">
                    <aside id="nav_menu-2" className="footer-widget widget_nav_menu">
                      <h4 className="footer-widget-title">Resources</h4>
                      <div className="menu-resources-container">
                        <ul id="menu-resources" className="menu">
                          <li id="menu-item-13" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-13"><a href="/contact/">Contact Us</a></li>
                          <li id="menu-item-31" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-31"><a href="/tos/">Terms of Service</a></li>
                        </ul>
                      </div>
                    </aside>
                  </div>
                  <div className="footer-widget-column col-xs-12 col-sm-6 col-lg-3">
                    <aside id="nav_menu-1" className="footer-widget widget_nav_menu">
                      <h4 className="footer-widget-title">Company</h4>
                      <div className="menu-company-container">
                        <ul id="menu-company" className="menu">
                          <li id="menu-item-11" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-11"><a href="/contact/">Customer Support</a></li>
                          <li id="menu-item-12" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-12"><a href="/about/">About PatronGate</a></li>
                          <li id="menu-item-53" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-53"><a href="/deals/">Deals of the Week</a></li>
                        </ul>
                      </div>
                    </aside>
                  </div>
                </div>
              </div>
            </footer>

        <footer id="colophon" className="site-footer" style={{'backgroundColor':'#22498e', 'color':'#a1b5d6'}}>
          <div className="container">
            <div className="site-info">
              Copyright PatronGate © 2018 - All Rights Reserved
            </div>
            <div className="site-social"></div>
          </div>
        </footer>
      </div>
        );
    }
}


export default Footer;
