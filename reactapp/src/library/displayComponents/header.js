import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {NumberInput, TextInput, CSSInput} from 'library';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [

                <TextInput label={'text'} name={'text'} default='' />,
                <NumberInput label={'size'} name={'size'} default={3} />,
                <CSSInput label={'css'} name={'style'} default={{}} />
            ],
        }
    }


    render() {
        var style = this.props.style || {};

        var header = <h1 style={style}>{this.props.text}</h1>;
        if (this.props.size) {
            if (this.props.size == 2) {
                header = <h2 style={style}>{this.props.text}</h2>;
            }
            else if (this.props.size == 3) {
                header = <h3 style={style}>{this.props.text}</h3>;
            }
            else if (this.props.size == 4) {
                header = <h4 style={style}>{this.props.text}</h4>;
            }
            else if (this.props.size == 5) {
                header = <h5 style={style}>{this.props.text}</h5>;
            }
            else if (this.props.size == 6) {
                header = <h6 style={style}>{this.props.text}</h6>;
            }
        }
        return (header);
    }
}

export default Header;
