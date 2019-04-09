import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {Div, NumberInput, CSSInput, AddChildComponent} from 'library';

class Container extends React.Component {
    static config = {
        form_components: [
            <NumberInput label={'order'} name={'order'} />,
            <CSSInput label={'css'} name={'style'} default={{}} />,
        ],
        can_have_children: true,
    }

    render() {

        return (
            <Div className="container" style={this.props.style}>
                {this.props.children}
            </Div>
        );
    }
}


export default Container;
