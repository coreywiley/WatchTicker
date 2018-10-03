import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header} from 'library';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            top: 49.3457868, //north lat
            bottom:  24.7433195, //south lat
            left: -124.7844079, //west long
            right: -66.9513812, //east long
            placeService: null,
            east: -66.9513812,
            north: 49.3457868
        };

    }

    componentDidMount(){
        var map = new window.google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.867, lng: 151.195},
          zoom: 15
        });
        var places = new window.google.maps.places.PlacesService(map);

        this.setState({
            placeService: places,
        }, this.search.bind(this));
    }

    setGlobalState() {

    }

    search() {
        this.state.placeService.nearbySearch({
            name: 'Do It Best',
            location: {lat: parseInt(this.state.top), lng: parseInt(this.state.right)},
            radius: 50000,
            type: ['store']
        }, function(results, status) {
            console.log(results + " : " + status);

            if (status == 'OVER_QUERY_LIMIT'){
                this.searchHoldLong();
                return false;
            }

            console.log("Found " + results.length + " results  " + this.state.top + ' : ' + this.state.right + " ::: " + this.state.bottom + ' : ' + this.state.left);

            if (results.length > 0){
                Array.prototype.push.apply(window.secretReactVars['places'],results);
            }

            var again = true;
            var top = this.state.top;
            var right = this.state.right;
            if (top > this.state.bottom){
                top = top - 1;
            } else {
                if (right > this.state.left){
                    top = this.state.north;
                    right = right - 1;
                } else {
                    again = false;
                }
            }

            if (again){
              this.setState({
                  top: top,
                  right: right,
              }, this.searchHold.bind(this));
            }

      }.bind(this));

    }

    searchHold(){
        setTimeout(
            function() {
                this.search();
            }.bind(this),
        1000);
    }
    searchHoldLong(){
        setTimeout(
            function() {
                this.search();
            }.bind(this),
        10000);
    }

    render() {




      var content =
        <div className='container'>
            <br/><br/>
            <div style={{textAlign:"center"}}>
                <h1>Welcome to ARGNNN</h1>
                <br/>

                <Button href={'/signUp/'} text={"Sign Up"} type={'success'} />
                <br />
                <Button href={'/logIn/'} text={"Log In"} type={'info'} />
            </div>
        </div>;

        return (
            <Wrapper token={this.props.user_id} loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Home;
