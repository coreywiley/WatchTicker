import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {NumberInput, Select, CSSInput} from 'library';

var BOOLEANS = [
  {'text':'True', value:true},
  {'text':'False', value:false},
];

class TextInput extends Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <NumberInput label={'order'} name={'order'} />,
                <TextInput label={'name'} name={'name'} default={'Default Text'} />,
                <TextInput label={'default'} name={'default'} />,
                <TextInput label={'placeholder'} name={'placeholder'} />,
                <TextInput label={'label'} name={'label'} />,
                <Select label={'required'} name={'required'} options={BOOLEANS} />,
                <TextInput label={'class'} name={'className'} />,
                <CSSInput label={'css'} name={'style'} default={{}} />,
            ],
        }
    }

    render() {

        var layout = '';
        if (this.props.layout) {
            layout = this.props.layout;
        }

        var style = this.props.style || {};

        var input = <input type="text" className="form-control" name={this.props.name}
            onChange={this.props.handleChange} value={this.props.value} placeholder={this.props.placeholder}
            onKeyPress={this.props.handleKeyPress} style={style}
            onBlur={this.props.onBlur} />;
        if (this.props.autoFocus) {
          input = <input autoFocus type="text" className="form-control" name={this.props.name}
              onChange={this.props.handleChange} value={this.props.value} placeholder={this.props.placeholder}
              onKeyPress={this.props.handleKeyPress} style={style}
              onBlur={this.props.onBlur} />
        }

        var label = null;
        if (this.props.label && this.props.label != '') {
            label = <label>{this.props.label}</label>;
        }

        return (
              <div className={"form-group " + this.props.layout}>
                {label}
                {input}
              </div>
        )


    }
}

export default TextInput;
