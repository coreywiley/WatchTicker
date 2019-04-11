import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {NumberInput, CSSInput} from 'library';

class Break extends React.Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <NumberInput label={'order'} name={'order'} />,
                <CSSInput label={'css'} name={'style'} default={{}} />,
            ],
        }
    }
    
    render() {
        return (
            <br style={this.props.style || {}} />
        );
    }
}


export default Break;
