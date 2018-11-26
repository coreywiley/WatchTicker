import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';
import {Stars} from 'library';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
//<Card name={this.state.deals[index]['name']} description={this.state.deals[index]['description']} button={'Read More'} button_type={'primary'} link={'/deal/' + this.state.deals[index]['id'] + '/'} />
class Card extends React.Component {
  constructor(props) {
    super(props);

    this.redirect = this.redirect.bind(this);
  }

  redirect() {
    window.location.href = this.props.link;
  }

    render() {
        var button = <a href={this.props.link} className={"btn btn-patron"}>{this.props.button}</a>;

        var image = <img className="card-img-top" style={{'maxHeight':'325px'}} src={this.props.imageUrl} alt={this.props.imageAlt} />

        var review = null;
        if (this.props.reviews && this.props.reviews.length > 0) {
          var totalReview = 0;
          for (var index in this.props.reviews) {
            totalReview += this.props.reviews[index]['review']['rating'];
          }
          var averageReview = Math.floor(totalReview/this.props.reviews.length)
          var review = <div><Stars filled={averageReview} /> ({this.props.reviews.length})</div>
        }

        var padding = '5px';
        if (isMobile) {
          padding = '0px';
        }

        var distance = null;
        if (this.props.distance != "NaN" && this.props.distance) {
          distance = <p>~{this.props.distance} miles</p>
        }

        return (
            <div className="card col-md-4 dealCard" style={{'padding':padding, 'cursor':'pointer', 'height':'475px'}} onClick={this.redirect} data-id={this.props.data_id} >
              {image}
              <div className="card-body">
                <h5 className="card-title" style={{'margin':'0px', 'fontWeight':'bold'}}>{this.props.name}</h5>
                {distance}
                <p className="card-text" style={{'color':'#999'}}>{this.props.description.substring(0,100)}...<br/>{this.props.address}<br/>{review}</p>
              </div>
            </div>
        );
    }
}


export default Card;
