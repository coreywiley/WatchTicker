import React, { Component } from 'react';
import {resolveVariables} from 'functions';

class Card extends React.Component {

    render() {

        var image = <div></div>;
        if (this.props.imageUrl) {
            image = <img className="card-img-top" src={this.props.imageUrl} alt={this.props.imageAlt} />
        }

        var extraClass = '';
        if (this.props.cssClass) {
            extraClass = ' ' + this.props.cssClass;
        }

        console.log("Buttons!",this.props.buttons);

        return (
            <div className={"card " + this.props.className || ''} style={this.props.css} data-id={this.props.data_id} >
              {image}
              <div className="card-body">
                <h5 className="card-title">{this.props.name}</h5>
                <div className="card-text">{this.props.description}</div>
                {this.props.buttons}
              </div>
            </div>
        );
    }
}


export default Card;
