import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar} from 'library';

class Footer extends React.Component {
    render() {
        return (
          <div className="footer-wrapper">
            <footer id="colophon" className="site-footer" style={{'backgroundColor':'#22498e', 'color':'#a1b5d6'}}>
              <div className="container">
                <div className="site-info">
                  Copyright © 2018 - All Rights Reserved
                </div>
                <div className="site-social"></div>
              </div>
            </footer>
          </div>
        );
    }
}


export default Footer;
