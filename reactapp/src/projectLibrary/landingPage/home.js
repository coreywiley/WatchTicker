import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';
import HeaderSection from './headerSection.js';
import FeaturesSection from './featuresSection.js';
import CTASection from './CTASection.js';
import PricingSection from './pricingSection.js';
import TestimonialSection from './testimonialSection.js';
import ContactSection from './contactSection.js';
import {Button, Modal, Select, Form, NumberInput, TextArea} from 'library';
import ajaxWrapper from "base/ajax.js";

class AddSection extends Component {
  constructor(props) {
    super(props);
    var type = 'HeaderSection';
    var order = 1;
    var data = '';

    if (this.props.pagecomponent_id) {
      type= this.props.type;
      order = this.props.order;
      data = this.props.data;
    }

    this.state = {'modal':false, 'type':type, 'order':order, 'data':data}

    this.clickHandler = this.clickHandler.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  clickHandler() {
    this.setState({'modal':!this.state.modal})
  }

  redirect() {
    this.props.refresh();
    this.clickHandler();
  }

  render() {

    if (this.state.modal) {
      var Components = [Select, NumberInput, TextArea];
      var type = {'value':'','name':'type','label':'Type:', 'options': [{'text':'HeaderSection', 'value':'HeaderSection'},{'text':'FeaturesSection', 'value':'FeaturesSection'}]}
      var order = {'value':'','name':'order','label':'Order:','placeholder': 1}
      var data = {'value':'', 'name':'data','label':'Data'}
      var ComponentProps = [type, order, data];
      var defaults = this.state;

      var submitUrl = "/api/home/pagecomponent/";
      if (this.props.pagecomponent_id) {
        submitUrl += this.props.pagecomponent_id + '/';
      }

      var deleteUrl = undefined;
      if (this.props.pagecomponent_id) {
        deleteUrl = "/api/home/pagecomponent/" + this.props.pagecomponent_id + "/delete/";
      }

      var componentForm = <Form components={Components} redirect={this.clickHandler} componentProps={ComponentProps} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} />

      return (
        <Modal content={componentForm} title={'Add Section'} onHide={this.clickHandler} show={true} />
      )
    }
    else {
      if (this.props.pagecomponent_id) {
        var title = 'Edit Section'
      }
      else {
        var title = 'Add Section'
      }
    return (

      <div style={{height:'40px', backgroundColor:'#eee', textAlign:'center'}}>
        <Button text={title} type={'success'} clickHandler={this.clickHandler} />
      </div>
    )
  }
}

}


class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {'components': [], loaded:false}
      this.refresh = this.refresh.bind(this);
      this.setComponents = this.setComponents.bind(this);
    }

    componentDidMount() {
      this.refresh();
    }

    refresh() {
      ajaxWrapper('GET','/api/home/pagecomponent/', {}, this.setComponents)
    }

    setComponents(result) {
      console.log("Set Components", result)
      var types = {'HeaderSection': HeaderSection, 'FeaturesSection':FeaturesSection}

      if (this.props.admin == 'admin') {
        var components = [<AddSection />];
      }
      else {
        var components = [];
      }
      for (var index in result) {
        var pagecomponent = result[index]['pagecomponent']
        var Component = types[pagecomponent.type]
        var data = JSON.parse(pagecomponent.data)
        console.log("Data", data)
        components.push(<Component {...data} />)

        if (this.props.admin == 'admin') {
          var data = JSON.stringify(pagecomponent.data)
          components.push(<AddSection pagecomponent_id={pagecomponent.id} type={pagecomponent.type} order={pagecomponent.order} data={data} />)
          components.push(<AddSection />)
        }
      }

      this.setState({'components':components, 'loaded':true})
    }

    render() {

      var pageContents = this.state.components

      var content = <div>
        {pageContents}
    </div>

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
        );
    }
}

export default Home;
