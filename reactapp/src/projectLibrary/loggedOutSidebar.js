import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar} from 'library';

class Sidebar extends React.Component {

    render() {

        return (
          <aside className="sidebar sidebar-icons-right sidebar-icons-boxed sidebar-expand-lg">
            <header className="sidebar-header">
              <span className="logo">
                <a href="/dashboard/"><img src="/static/images/logo.png" alt="logo" /></a>
              </span>
              <span className="sidebar-toggle-fold"></span>
            </header>

            <nav className="sidebar-navigation ps-container ps-theme-default ps-active-y" data-ps-id="330c98ac-e85f-fe33-3990-40ca999f7959">
              <ul className="menu">
                <li class="menu-category">Welcome</li>

                <li className={"menu-item"}>
                  <a className="menu-link" href="/logIn/">
                    <span className="title">Log In</span>
                  </a>
                </li>

                <li className={"menu-item"}>
                  <a className="menu-link" href="/signUp/">
                    <span className="title">Sign Up</span>
                  </a>
                </li>


              </ul>
            <div class="ps-scrollbar-x-rail" style={{"left":"0px", "bottom":"0px"}}><div class="ps-scrollbar-x" tabindex="0" style={{"left": "0px", "width": "0px"}}></div></div><div class="ps-scrollbar-y-rail" style={{"top": "0px", "height": "830px", "right": "2px"}}><div class="ps-scrollbar-y" tabindex="0" style={{"top": "0px", "height": "678px"}}></div></div></nav>

          </aside>
        );
    }
}


export default Sidebar;
