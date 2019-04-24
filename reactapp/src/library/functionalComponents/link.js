import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {TextInput} from 'library';

class Link extends React.Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <TextInput label={'Link'} name={'link'} />,
                <TextInput label={'Target'} name={'target'} />,
                <TextInput label={'Text'} name={'text'} />,
                <TextInput label={'Class'} name={'class'} />,
            ],
            can_have_children: true,
        }
    }


    render() {
      var target = '_self';
      if (this.props.target) {
        target= this.props.target;
      }

        return (
            <a href={this.props.link} target={target} className={this.props.class}>
                {this.props.text}
                {this.props.children}
            </a>
        );
    }
}


export default Link;
