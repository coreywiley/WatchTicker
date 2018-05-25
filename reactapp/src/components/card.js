import React, { Component } from 'react';

import ajaxWrapper from "../base/ajax.js";
import Wrapper from '../base/wrapper.js';


class Card extends Component {

    render() {

        return (
            <div className="card" style={{width: "18rem"}}>
              <div className="card-body">
                <h5 className="card-title">{this.props.name}</h5>
                <p className="card-text">{this.props.description}</p>
                <a href={this.props.link} className={"btn btn-" + this.props.button_type}>{this.props.button}</a>
              </div>
            </div>
        );
    }
}

export default Card;