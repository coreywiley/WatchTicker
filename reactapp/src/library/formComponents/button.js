import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables, run_functions} from 'functions';
import {Modal, NumberInput, TextInput, Select, CSSInput} from 'library'
//<Button type={'success'} text={'Add New Event'} href={'/newEvent/'} />

var BOOLEANS = [
  {'text':'True', value:true},
  {'text':'False', value:false},
];

var BUTTON_TYPES = [
  {'text': 'primary', value: 'primary'},
  {'text': 'secondary', value: 'secondary'},
  {'text': 'success', value: 'success'},
  {'text': 'danger', value: 'danger'},
  {'text': 'warning', value: 'warning'},
  {'text': 'info', value: 'info'},
  {'text': 'light', value: 'light'},
  {'text': 'dark', value: 'dark'},
  {'text': 'link', value: 'link'},
  {'text': 'outline-primary', value: 'outline-primary'},
  {'text': 'outline-secondary', value: 'outline-secondary'},
  {'text': 'outline-success', value: 'outline-success'},
  {'text': 'outline-danger', value: 'outline-danger'},
  {'text': 'outline-warning', value: 'outline-warning'},
  {'text': 'outline-info', value: 'outline-info'},
  {'text': 'outline-light', value: 'outline-light'},
  {'text': 'outline-dark', value: 'outline-dark'},
];


class Button extends React.Component {
    static config = {
        form_components: [
            <NumberInput label={'order'} name={'order'} />,
            <TextInput label={'text'} name={'text'} default={'Default Text'} />,
            <Select label={'type'} name={'type'} options={BUTTON_TYPES} />,
            <TextInput label={'href'} name={'href'} />,
            <TextInput label={'class'} name={'className'} />,
            <CSSInput label={'css'} name={'style'} default={{}} />,
            <Select label={'hover'} name={'hover'} options={BOOLEANS} />,
            <Select label={'disabled'} name={'disabled'} options={BOOLEANS} />,
            <Select label={'deleteType'} name={'deleteType'} options={BOOLEANS} />,
        ],
    }

    constructor(props) {
      super(props);

      this.state = {
          modal: false,
          hover: false,
      }

      this.showModal = this.showModal.bind(this);
      this.hideModal = this.hideModal.bind(this);
      this.click = this.click.bind(this);
    }

    showModal() {
      this.setState({modal:true});
    }

    hideModal() {
      this.setState({modal:false});
    }

    click(e) {
        e.preventDefault();
        console.log("Clicked");
        if (this.props.href) {
            window.location.href = this.props.href;
        }
        else if (this.props.onClick) {
            this.props.onClick(e);
        }
        else if (this.props.functions) {
          run_functions(this.props.functions, this.setState, this.props.setGlobalState)
        }
    }

    render() {
      var type = "btn-" + this.props.type;
      var style = {}
      if (this.props.style) {
        style = this.props.style;
      }

        var hover = null;
        if (this.props.hover) {
            var hoverCSS = {
                position: 'absolute',
                top:'0px',
                right:'0px',
                padding:'2px 10px',
                margin: '2px',
                borderRadius: '100px',
                background: '#c82333',
            };

            var props = {
                onMouseEnter: this.onMouseEnter.bind(this),
                onMouseLeave: this.onMouseLeave.bind(this),
            };

            if (this.state.hover){
                hover = <div className="hoverClose" style={hoverCSS}>x</div>;
            }
        }

        if (this.props.disabled) {
        var content = <button className={"btn " + type} onClick={this.click} style={style} disabled>{this.props.text}</button>
      }
      else {
        var content = <button className={"btn " + type} onClick={this.click} style={style}>{this.props.text}</button>
      }

        if (this.props.deleteType == true && this.state.modal == false) {
            console.log("I am here");
            return (
                <button className={"btn " + type} onClick={this.showModal}
                num={this.props.num} style={style}>{this.props.text}</button>
            );

        } else if (this.props.deleteType == true && this.state.modal == true) {
            var alt = <button className={"btn btn-success"} onClick={this.hideModal} style={{'margin':'15px'}}>Dont Delete</button>;
            var button = <button className={"btn " + type} onClick={this.click} style={style}>{this.props.text}</button>;
            return (
                <Modal content={[alt,button]} show={true} title={'Are you sure?'} onHide={this.hideModal} />
            );

        } else {
            return (
                <button className={"btn " + type} onClick={this.click}
                num={this.props.num} style={style}>{this.props.text}</button>
            );
        }

    }
}

export default Button;
