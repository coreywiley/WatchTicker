import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {TextInput, CSSInput} from 'library';

class Span extends React.Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <TextInput label={'text'} name={'text'} default={'Default Text'} />,
                <CSSInput label={'css'} name={'style'} default={{}} />
            ],
        }
    }

    render() {
        return (
            <span style={this.props.style || {}}>{this.props.text}</span>
        );
    }
}

export default Span;
