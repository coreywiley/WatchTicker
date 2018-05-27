import React, { Component } from 'react';

import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';


class Card extends Component {

    render() {
        var button = null;
        if (this.props.link){
            button = <a href={this.props.link} className={"btn btn-" + this.props.button_type}>{this.props.button}</a>;
        } else {
            button = <div className={"btn btn-" + this.props.button_type} onClick={this.props.onClick}>{this.props.button}</div>;
        }


        return (
            <div className="card" style={{width: "18rem"}}>
              <div className="card-body">
                <h5 className="card-title">{this.props.name}</h5>
                <p className="card-text">{this.props.description}</p>
                {button}
              </div>
            </div>
        );
    }
}

export default Card;
