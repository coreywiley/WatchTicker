import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {NumberInput, TextInput, CSSInput} from 'library';

class Paragraph extends React.Component {
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
            <p onClick={this.props.onClick} style={this.props.style || {}}>{this.props.text}</p>
        );
    }
}

export default Paragraph;
