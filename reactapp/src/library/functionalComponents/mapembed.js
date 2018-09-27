import React, { Component } from 'react';
import {
    Map, InfoWindow,
    Marker, GoogleApiWrapper
} from 'google-maps-react';

export class MapEmbed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            map: null,
        };
    }

  componentDidMount(){
      var geocoder = new window.google.maps.Geocoder;
      var infowindow = new window.google.maps.InfoWindow;
      var placeId = this.props.placeId;

      geocoder.geocode({'placeId': placeId}, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
              this.setState({
                 center: results[0]['geometry']['location'],
                 place: results[0],
              });

          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
    }.bind(this));
  }

  onMarkerClick(props, marker, e){
      this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      });
  }

  onMapClicked(props) {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }

  render() {
      var place = this.state.place;
      var center = this.state.center;
      var marker = null;
      if (place){
          marker = <Marker onClick={this.onMarkerClick.bind(this)}
              position={center}
              place={place} />;
      }

    return (
      <Map google={this.props.google}
          onClick={this.onMapClicked.bind(this)}
          center={center}
          >
        {marker}
      </Map>
    )
  }
}


export default GoogleApiWrapper({
  apiKey: ('AIzaSyA75SXaNNsVtJVayxlKtDAeF5ZBSVomrzM')
})(MapEmbed);
