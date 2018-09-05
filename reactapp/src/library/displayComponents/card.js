import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Card extends React.Component {

    render() {
        var button = null;
        if (this.props.link){
            button = <a href={this.props.link} className={"btn btn-" + this.props.button_type}>{this.props.button}</a>;
        } else {
            if (this.props.buttonComponent) {
                let ButtonComponent = this.props.buttonComponent;
                button = <ButtonComponent {...this.props.buttonComponentProps} />
            } else {
                if (this.props.globalStateName) {
                    button = <div className={"btn btn-" + this.props.button_type} onClick={() => this.props.onClick(this.props.globalStateName, this.props)}>{this.props.button}</div>;
                }
                else {
                    button = <div className={"btn btn-" + this.props.button_type} onMouseDown={() => this.props.onClick(this.props)}>{this.props.button}</div>;
                }
            }
        }

        var image = <div></div>;
        if (this.props.imageUrl) {
            image = <img className="card-img-top" src={this.props.imageUrl} alt={this.props.imageAlt} />
        }

        var extraClass = '';
        if (this.props.cssClass) {
            extraClass = ' ' + this.props.cssClass;
        }

        return (
            <div className="card" style={this.props.css} data-id={this.props.data_id} >
              {image}
              <div className="card-body">
                <h5 className="card-title">{this.props.name}</h5>
                <div className="card-text">{this.props.description}</div>
                {button}
              </div>
            </div>
        );
    }
}


export default Card;
