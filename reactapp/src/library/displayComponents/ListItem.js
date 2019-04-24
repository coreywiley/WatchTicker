import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {TextInput, CSSInput, Icon, NumberInput} from 'library';

class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <TextInput label={'Text'} name={'text'} />,
                <TextInput label={'Class'} name={'class'} />,
                <CSSInput label={'css'} name={'css'} default={{}} />,
            ],
            can_have_children: true,
        }
    }

    render() {
        var css = this.props.css || {};
        return (
            <li style={css} className={this.props.class}>
                {this.props.text}
                {this.props.children}
            </li>
        );
    }
}


export default ListItem;
