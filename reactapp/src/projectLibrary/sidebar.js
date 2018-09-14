import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar} from 'library';

class Sidebar extends React.Component {
    constructor(props) {
      super(props);
      this.state = {'domains':[], loaded: false}

      this.domainCallback = this.domainCallback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper('GET','/api/home/domain/?related=emoji_slider&user=' + this.props.user, {}, this.domainCallback)
    }

    domainCallback(result) {
      this.setState({'domains':result, loaded:true})
    }

    render() {

        var domainList = [];
        for (var index in this.state.domains) {
          var active = '';
          var domain = this.state.domains[index]['domain'];
          console.log("Domain",domain)
          var promptList = [];
          for (var index2 in this.state.domains[index]['domain']['emoji_slider']) {
            var emojislider = domain['emoji_slider'][index2]['emojislider'];
            console.log("Emoji Slider",emojislider)
            promptList.push(<li className="menu-item">
              <a className="menu-link" href={'/sliderDetails/' + domain.id + '/' + emojislider.id + '/'}>
                <span className="dot"></span>
                <span className="title" style={{'whiteSpace':'normal','flexShrink':'unset'}}>{emojislider.prompt}</span>
              </a>
            </li>)
          }
          promptList.push(<li className="menu-item">
            <a className="menu-link" href={'/sliderEditor/' + domain.id + '/'}>
              <span className="dot"></span>
              <span className="title">Add New Emoji Slider</span>
            </a>
          </li>)

          if (this.props.domain == domain.id) {
            active = 'active';
          }
          domainList.push(<li className={"menu-item " + active}>
            <a className="menu-link" href="#">
              <span className="title">{domain['name']}</span>
            </a>
            <ul className="menu-submenu" style={{"display": "none"}}>
            {promptList}
            </ul>
          </li>)
        }

        if (this.props.domain == "New") {
          active = "active"
        } else {
          active = '';
        }
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
                <li class="menu-category">Domains</li>
                {domainList}

                <li className={"menu-item " + active}>
                  <a className="menu-link" href="/newDomain/">
                    <span className="title">Add New Domain</span>
                  </a>
                </li>

                <li class="menu-category">Log Out</li>
                <li className={"menu-item"}>
                  <a className="menu-link" href='/logOut/'>
                    <span className="title" style={{'color':'white'}}>Log Out</span>
                  </a>
                </li>
              </ul>
            <div class="ps-scrollbar-x-rail" style={{"left":"0px", "bottom":"0px"}}><div class="ps-scrollbar-x" tabindex="0" style={{"left": "0px", "width": "0px"}}></div></div><div class="ps-scrollbar-y-rail" style={{"top": "0px", "height": "830px", "right": "2px"}}><div class="ps-scrollbar-y" tabindex="0" style={{"top": "0px", "height": "678px"}}></div></div></nav>

          </aside>
        );
    }
}


export default Sidebar;
