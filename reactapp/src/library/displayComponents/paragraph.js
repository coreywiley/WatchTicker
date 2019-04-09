import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {NumberInput, TextInput, CSSInput} from 'library';

class Paragraph extends React.Component {
    static config = {
        form_components: [
            <NumberInput label={'order'} name={'order'} />,
            <TextInput label={'text'} name={'text'} default={'Default Text'} />,
            <CSSInput label={'css'} name={'style'} default={{}} />
        ],
    }

    render() {
        return (
            <p style={this.props.style || {}}>{this.props.text}</p>
        );
    }
}

export default Paragraph;
