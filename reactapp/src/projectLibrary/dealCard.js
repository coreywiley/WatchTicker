import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

//<Card name={this.state.deals[index]['name']} description={this.state.deals[index]['description']} button={'Read More'} button_type={'primary'} link={'/deal/' + this.state.deals[index]['id'] + '/'} />
class Card extends React.Component {

    render() {
        var button = <a href={this.props.link} className={"btn btn-patron"}>{this.props.button}</a>;

        var image = <img className="card-img-top" src={this.props.imageUrl} alt={this.props.imageAlt} />

        return (
            <div className="card col-md-4" style={{'padding':'0px'}} data-id={this.props.data_id} >
              {image}
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
