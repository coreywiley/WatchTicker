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
                <TextInput label={'Icon'} name={'icon'} />,
                <NumberInput label={'Icon Size'} name={'size'} />,
                <CSSInput label={'css'} name={'css'} default={{}} />,
            ],
            can_have_children: false,
        }
    }

    render() {
        var icon = null;
        if (this.props.icon) {
            icon = <Icon size={this.props.size} icon={this.props.icon} list_icon={true} />;
        }
        var css = this.props.css || {};
        return (
            <li style={css} className={this.props.class}>
                {icon}
                {this.props.text}
            </li>
        );
    }
}


export default ListItem;
