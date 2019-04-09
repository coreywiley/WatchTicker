import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {NumberInput, TextInput, CSSInput, AddChildComponent} from 'library';

class Div extends React.Component {
    static config = {
        form_components: [
            <NumberInput label={'order'} name={'order'} />,
            <TextInput label={'class'} name={'className'} default={''} />,
            <CSSInput label={'css'} name={'style'} default={{}} />,
        ],
        can_have_children: true,
    }

    render() {
        return (
            <div className={this.props.className || ''} style={this.props.style || {}}>
                {this.props.children}
            </div>
        );
    }
}


export default Div;
