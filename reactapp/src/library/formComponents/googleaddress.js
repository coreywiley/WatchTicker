import React, { Component } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import TextInput from './textinput.js';
import Select from './select.js';
import ajaxWrapper from "base/ajax.js";


class GoogleAddress extends Component {
  constructor(props) {
    super(props);

    this.state = { address: '', street:'', state:'', street2:'', city:'',zip:''};
    this.handleChange = this.handleChange.bind(this);
  }

  handleAddressChange = address => {
    this.props.setFormState({street:address})
  };

  handleChange = (e) => {

       var name = e.target.getAttribute("name");
       var newState = {};
       newState[name] = e.target.value;
       console.log("handlechange",name,newState)
        var currentState = this.state;
        currentState[name] = newState[name];

        this.setState(newState, this.props.setFormState(currentState));
    }

  handleSelect = (address, placeId) => {
    var addressSplit = address.split(',');
    var street = addressSplit[0].trim();
    var city = addressSplit[1].trim();
    var state = addressSplit[2].trim();
    var country = addressSplit[3].trim();
    var currentState = this.state;
    currentState['address'] = address;
    currentState['street'] = street;
    currentState['city'] = city;
    currentState['state'] = state;
    currentState['country'] = country;
    currentState['placeId'] = placeId;

    this.props.setFormState({
        address: address,
        street: street,
        state:state,
        city:city,
        country: country,
        placeId: placeId
    });
  };



  render() {
    return (
    <div>
        <label>Street Address</label>
      <PlacesAutocomplete
        value={this.props.street}
        onChange={this.handleAddressChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="form-group" style={{position:'relative'}}>
            <input
              {...getInputProps({
                placeholder: 'Your Address...',
                className: 'form-control',
              })}
            />
            <div className="list-group" style={{position:'absolute', top:'38px', left:'0px', width:'100%', zIndex:'100'}}>
              {loading && <div className="list-group-item">Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'list-group-item active'
                  : 'list-group-item';
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>

      <TextInput name={'street2'} handlechange={this.props.handlechange} placeholder={'Apt/Bldg/Suite Number'} label={'Apt/Bldg/Suite Number'} value={this.props.street2} />
      <TextInput name={'city'} handlechange={this.props.handlechange} placeholder={'City'} label={'City'} value={this.props.city} />
      <div className="row container">
          <div className="col-sm-6">
            <Select value={this.props.state} handlechange={this.props.handlechange} defaultoption={'State'} label={'State'} layout={'row'} options={[{'value':'CO','text':'CO'},{'value':'DE','text':'DE'},{'value':'NY','text':'NY'}]} name={'state'} />
          </div>
          <div className="col-sm-6">
            <TextInput name={'zip'} label={'Zip Code'} handlechange={this.props.handlechange} placeholder={'Zip Code'} value={this.props.zip} layout={'row'} />
          </div>
      </div>
          <br/>
      </div>
    );
  }
}

export default GoogleAddress;
