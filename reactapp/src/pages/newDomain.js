import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, Header} from 'library';
import Nav from 'projectLibrary/nav.js';
import Sidebar from 'projectLibrary/sidebar.js';

class NewDomain extends Component {

    render() {
        var Components = [TextInput, TextInput];
        var name_props = {'value':'','name':'name','label':'Name','placeholder': 'Emoji Slider'}
        var domain_name_props = {'value':'','name':'domain_name','label':'Domain Name','placeholder': 'www.emojislider.com'}

        var ComponentProps = [name_props, domain_name_props];
        var defaults = {'name':'', 'domain_name':'','user':this.props.user_id};

        var submitUrl = "/api/home/domain/";

        var content = <div className="container" style={{'marginTop':'100px'}}>
                <Header size={2} text={'Add New Domain'} />
                <Form components={Components} redirectUrl={'/dashboard/'} componentProps={ComponentProps} submitUrl={submitUrl} defaults={defaults} />
        </div>;

        if (this.props.user_id) {
          return (
              <div>
              <Nav />
                <Sidebar domain={"New"} user={this.props.user_id} logOut={this.props.logOut} />
                <Wrapper loaded={true} content={content} />
              </div>
               );
        }
        else {
          return (
              <div>
              </div>
               );
        }

    }
}
export default NewDomain;
