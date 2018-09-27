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
            place: null,
            places: [],
            center: this.props.center
        };
    }

  componentDidMount(){
      var geocoder = new window.google.maps.Geocoder;
      var infowindow = new window.google.maps.InfoWindow;
      var placeId = this.props.placeId;
      if (placeId){
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
    } else if (this.props.placeIds.length > 0){
        for (var i in this.props.placeIds){
            var placeId = this.props.placeIds[i];
            geocoder.geocode({'placeId': placeId}, function(results, status) {
              if (status === 'OK') {
                if (results[0]) {
                    var places = this.state.places;
                    places.push(results[0]);
                    this.setState({
                        center: {lat: 39.3573643, lng: -101.1152616},
                       places: places,
                    });
                } else {
                  window.alert('No results found');
                }
              } else {
                window.alert('Geocoder failed due to: ' + status);
              }
          }.bind(this));
        }
    }

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
      var center = this.state.center

      var marker = null;
      var markers = [];

      if (place){
          marker = <Marker onClick={this.onMarkerClick.bind(this)}
              position={center}
              place={place} />;
      }
      for (var i in this.state.places){
          markers.push(
              <Marker onClick={this.onMarkerClick.bind(this)}
                  position={this.state.places[i]['geometry']['location']}
                  place={this.state.places[i]} />
          );
      }



    return (
      <Map google={this.props.google}
          onClick={this.onMapClicked.bind(this)}
          center={center}
          zoom={this.props.zoom}
          >
        {marker}
        {markers}
      </Map>
    )
  }
}


export default GoogleApiWrapper({
  apiKey: ('AIzaSyA75SXaNNsVtJVayxlKtDAeF5ZBSVomrzM')
})(MapEmbed);
