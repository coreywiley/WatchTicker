import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {TextInput, NumberInput} from 'library';

class Icons extends Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <TextInput label={'Image Src'} name={'src'} />,
                <TextInput label={'Number of Icons'} name={'num_icons'} />,
                <TextInput label={'Width'} name={'width'} placeholder={'40px'} />,
            ],
        }
    }

    render() {

        var icons = [];
        for (var i = 0; i < parseInt(this.props.num_icons); i++) {
            icons.push(<img src={this.props.src} style={{width: this.props.width || '40px'}} />)
        }

        return (
            <div>
              {icons}
            </div>
        );
    }
}

export default Icons;
