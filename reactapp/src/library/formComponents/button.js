import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';
import {Modal} from 'library'
//<Button type={'success'} text={'Add New Event'} href={'/newEvent/'} />

class Button extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
          modal: false,
      }

      this.showModal = this.showModal.bind(this);
      this.hideModal = this.hideModal.bind(this);
      this.click = this.click.bind(this);
    }

    showModal() {
      this.setState({modal:true})
    }

    hideModal() {
      this.setState({modal:false})
    }

    click() {
      console.log("Clicked");
      if (this.props.href) {
        window.location.href = this.props.href;
      }
      else if (this.props.clickHandler) {
        console.log("Click Handler")
        this.props.clickHandler();
      }
    }

    render() {
    	var type = "btn-" + this.props.type;
      var css = {}
      if (this.props.css) {
        css = this.props.css;
      }

      if (this.props.disabled) {
        var content = <button className={"btn " + type} onClick={this.click} style={css} disabled>{this.props.text}</button>
      }
      else {
        var content = <button className={"btn " + type} onClick={this.click} style={css}>{this.props.text}</button>
      }

      if (this.props.deleteType == true && this.state.modal == false) {
        console.log("I am here");
        content = <button className={"btn " + type} onClick={this.showModal} style={css}>{this.props.text}</button>
      }
      else if (this.props.deleteType == true && this.state.modal == true) {
        var alt = <button className={"btn btn-success"} onClick={this.hideModal} style={{'margin':'15px', 'float':'left'}}>Dont Delete</button>;
        var button = <button className={"btn " + type} onClick={this.click} style={css}>{this.props.text}</button>;
        content = <Modal content={[alt,button]} show={true} title={'Are you sure?'} onHide={this.hideModal} />
      }

        return (
          <div>
            {content}
            </div>
        );
    }
}

export default Button;
