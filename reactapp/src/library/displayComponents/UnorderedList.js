import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {TextInput, CSSInput} from 'library';

class UnorderedList extends React.Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <TextInput label={'Class'} name={'class'} />,
                <CSSInput label={'css'} name={'style'} default={{}} />,
            ],
            can_have_children: true,
        }
    }

    render() {
        var css = this.props.css || {};
        return (
            <ul style={css} className={this.props.class}>
                {this.props.children}
            </ul>
        );
    }
}


export default UnorderedList;
