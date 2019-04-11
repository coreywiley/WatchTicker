import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {NumberInput, TextInput, AddChildComponent} from 'library';

class If extends Component {
    static config = {
        form_components: [
            <NumberInput label={'order'} name={'order'} />,
            <TextInput label={'logic'} name={'logic'} />,
        ],
        can_have_children: true,
    }

    render() {
        if (this.props.logic) {
            return (this.props.children)
        }
        else {
            return (null);
        }

    }
}

export default If;
