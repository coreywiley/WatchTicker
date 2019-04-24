import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {TextInput, Select} from 'library';

class Icon extends React.Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <TextInput label={'Icon'} name={'icon'} />,
                <TextInput label={'Size'} name={'size'} />,
                <TextInput label={'type'} name={'type'} />,
                <Select label={'List Icon?'} name={'list_icon'} options={[{'text':'True','value':true},{'text':'False','value':false}]} defaultOption={true} />
            ],
            can_have_children: true,
        }
    }

    render() {
        var size = 'fa-3x';
        if (this.props.size) {
            size = 'fa-' + this.props.size + 'x';
        }

       var icon = 'fa-' + this.props.icon;

       var type = this.props.type || 'fas';
       if (this.props.list_icon) {
           type += ' fa-li'
       }

        return (
            <i style={this.props.style} className={type + " " + size + " " + icon}></i>
        );
    }
}

export default Icon;
