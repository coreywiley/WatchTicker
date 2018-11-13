import React, { Component } from 'react';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import TextInput from './textinput.js';
import Select from './select.js';

class GoogleAddress extends Component {
  constructor(props) {
    super(props);

    this.state = { address: '', street:'', state:'', street2:'', city:'',zipcode:''};
    this.handleChange = this.handleChange.bind(this);
  }

  handleAddressChange = address => {
    console.log("Handle Address", address)
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

  handleSelect = address => {
    var addressSplit = address.split(',');

    var element = this;
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => element.props.setFormState({'lat':latLng['lat'],'lng':latLng['lng']}))
      .catch(error => console.error('Error', error));

    if (addressSplit.length == 3) {
      var street = '';
      var city = addressSplit[0].trim();
      var state = addressSplit[1].trim();
      var country = addressSplit[2].trim();
    }
    else {
      var street = addressSplit[0].trim();
      var city = addressSplit[1].trim();
      var state = addressSplit[2].trim();
      var country = addressSplit[3].trim();
    }

    var currentState = this.state;
    currentState['address'] = address;
    currentState['street'] = street;
    currentState['city'] = city;
    currentState['state'] = state;
    currentState['country'] = country;

    this.props.setFormState({address: address, street: street, state:state, city:city, country: country});
  };

  render() {

    var stateOptions = [
      {'value':'AL','text':'AL'},
      {'value':'AK','text':'AK'},
      {'value':'AZ','text':'AZ'},
      {'value':'AR','text':'AR'},
      {'value':'CA','text':'CA'},
      {'value':'CO','text':'CO'},
      {'value':'CT','text':'CT'},
      {'value':'DE','text':'DE'},
      {'value':'FL','text':'FL'},
      {'value':'GA','text':'GA'},
      {'value':'HI','text':'HI'},
      {'value':'ID','text':'ID'},
      {'value':'IL','text':'IL'},
      {'value':'KS','text':'KS'},
      {'value':'KY','text':'KY'},
      {'value':'LA','text':'LA'},
      {'value':'ME','text':'ME'},
      {'value':'MD','text':'MD'},
      {'value':'MA','text':'MA'},
      {'value':'MI','text':'MI'},
      {'value':'MN','text':'MN'},
      {'value':'MS','text':'MS'},
      {'value':'MO','text':'MO'},
      {'value':'MT','text':'MT'},
      {'value':'NE','text':'NE'},
      {'value':'NV','text':'NV'},
      {'value':'NH','text':'NH'},
      {'value':'NJ','text':'NJ'},
      {'value':'NM','text':'NM'},
      {'value':'NY','text':'NY'},
      {'value':'NC','text':'NC'},
      {'value':'ND','text':'ND'},
      {'value':'OH','text':'OH'},
      {'value':'OK','text':'OK'},
      {'value':'OR','text':'OR'},
      {'value':'PA','text':'PA'},
      {'value':'RI','text':'RI'},
      {'value':'SC','text':'SC'},
      {'value':'TN','text':'TN'},
      {'value':'TX','text':'TX'},
      {'value':'UT','text':'UT'},
      {'value':'VI','text':'VI'},
      {'value':'VT','text':'VT'},
      {'value':'VA','text':'VA'},
      {'value':'WA','text':'WA'},
      {'value':'WV','text':'WV'},
      {'value':'WI','text':'WI'},
      {'value':'WY','text':'WY'},
      {'value':'GU','text':'GU'},
      {'value':'PR','text':'PR'},
    ]

    var extras = null;
    if (this.props.extras != false) {
      extras = <div>
      <TextInput name={'street2'} handlechange={this.props.handlechange} placeholder={'Apt/Bldg/Suite Number'} label={'Apt/Bldg/Suite Number'} value={this.props.street2} />
      <TextInput name={'city'} handlechange={this.props.handlechange} placeholder={'City'} label={'City'} value={this.props.city} />
      <div className="row container">
      <div className="col-sm-6">
        <Select value={this.props.state} handlechange={this.props.handlechange} defaultoption={'State'} label={'State'} layout={'row'} options={stateOptions} name={'state'} />
      </div>
      <div className="col-sm-6">
        <TextInput name={'zipcode'} label={'Zip Code'} handlechange={this.props.handlechange} placeholder={'Zip Code'} value={this.props.zipcode} layout={'row'} />
      </div>
      </div>
      </div>
    }

    var label = null;
    if (this.props.extras != false) {
      label = <label>Street Address</label>
    }

    return (
    <div>
        {label}
      <PlacesAutocomplete
        value={this.props.street}
        onChange={this.handleAddressChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="form-group">
            <input
              {...getInputProps({
                placeholder: 'Your Address...',
                className: 'form-control',
              })}
            />
            <div className="list-group">
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

      {extras}

      </div>
    );
  }
}

export default GoogleAddress;
