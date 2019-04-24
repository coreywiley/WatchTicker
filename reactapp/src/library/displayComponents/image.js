import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {TextInput, CSSInput} from 'library';

class Image extends React.Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <TextInput label={'Image Url'} name={'src'} />,
                <CSSInput label={'css'} name={'style'} default={{}} />,
            ],
            can_have_children: false,
        }
    }

    render() {
        var css = this.props.css || {'width':'100%'};
        return (
            <img style={css} src={this.props.src} />
        );
    }
}


export default Image;
