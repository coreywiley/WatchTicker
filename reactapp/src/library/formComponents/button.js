import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';
import {Modal} from 'library'
//<Button type={'success'} text={'Add New Event'} href={'/newEvent/'} />

class Button extends React.Component {
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
      this.setState({modal:true})
    }

    hideModal() {
      this.setState({modal:false})
    }

    click(e) {
      console.log("Clicked");
      if (this.props.href) {
        window.location.href = this.props.href;
      }
      else if (this.props.clickHandler) {
        console.log("Click Handler")
        this.props.clickHandler(e);
      }
    }

    onMouseEnter(e) {
        this.setState({hover: true});
    }

    onMouseLeave(e) {
        this.setState({hover: false});
    }

    render() {
        var hover = null;
        if (this.props.hover){
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

        var type = "btn-" + this.props.type;
        var css = {position: 'relative'};
        if (this.props.css) {
            css = this.props.css;
        }

        var content = <button num={this.props.num} className={"btn " + type} onClick={this.click} style={css}>
            {this.props.text}{hover}</button>;

        if (this.props.deleteType == true && this.state.modal == false) {
            console.log("I am here");
            content = <button className={"btn " + type} onClick={this.showModal} style={css}>
                {this.props.text}{hover}</button>;

        } else if (this.props.deleteType == true && this.state.modal == true) {
            var alt = <button className={"btn btn-success"} onClick={this.hideModal} style={{'margin':'15px'}}>Dont Delete</button>;
            var button = <button className={"btn " + type} onClick={this.click} style={css}>
                {this.props.text}{hover}</button>;

            content = <Modal content={[alt,button]} show={true} title={'Are you sure?'} onHide={this.hideModal} />;
        }

        return (
            <div {...props} style={{display:"inline-block"}}>
                {content}
            </div>
        );
    }
}

export default Button;
