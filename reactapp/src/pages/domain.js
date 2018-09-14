import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Card, Header} from 'library';
import Nav from 'projectLibrary/nav.js';
import ajaxWrapper from 'base/ajax.js';
import Sidebar from 'projectLibrary/sidebar.js';

class Domain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            name: '',
        };
        this.domainCallback = this.domainCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/domain/' + this.props.domain, {}, this.domainCallback)
    }

    domainCallback(result) {
      var domain = result[0]['domain'];
      this.setState({name:domain.name, loaded:true})
    }

    render() {

      var lastInstanceData = {'name':"Create New Slider", 'description':"", 'link':"/sliderEditor/" + this.props.domain + '/', 'button':"Create New", 'button_type':"success"};
      var dataMapping = {'button_type':'primary', 'button':'View Details', 'link':'/sliderDetails/{id}/', 'name':'{prompt}', 'description':''};

      if (this.props.user_id) {
        return (
          <div>
          <div className="container">

            <Sidebar domain={this.props.domain} user={this.props.user_id} />
            <Header size={2} text={this.state.name} />
            <List dataUrl={"/api/home/emojislider/?domain=" + this.props.domain} component={Card} objectName={'emojislider'} dataMapping={dataMapping} lastInstanceData={lastInstanceData} />
          </div>
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

export default Domain;
