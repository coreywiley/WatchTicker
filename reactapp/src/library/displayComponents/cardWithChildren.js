import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {TextInput} from 'library';

class CardWithChildren extends Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <TextInput label={'name'} name={'name'} />,
            ],
            can_have_children: true,
        }
    }

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
                <div className="card-text">{this.props.children}</div>
              </div>
            </div>
        );
    }
}


export default CardWithChildren;
