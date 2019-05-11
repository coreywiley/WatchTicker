import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';

import {
  FormWithChildren, TextInput, Select, PasswordInput,
  Header, TextArea, NumberInput, DateTimePicker,
  ButtonGroup, Button, Accordion, LineBreak, Alert, Wrapper
} from 'library';


var MODEL_TYPES = [
    {'text':'Boolean', 'value':'Boolean'},
    {'text':'Datetime', 'value':'Datetime'},
    {'text':'Decimal', 'value':'Decimal'},
    {'text':'Integer', 'value':'Integer'},
    {'text':'Char', 'value':'Char'},
    {'text':'Text', 'value':'Text'},
]


class FieldInput extends Component {
    constructor(props) {
        super(props);

        this.removeField = this.removeField.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);
    }

    removeField() {
        this.props.removeField('fields', this.props.index);
    }

    setGlobalState(name, state) {
        delete state['children']
        this.props.setGlobalState('fields', this.props.index, state)
    }

    render() {

        var components = []
        components.push(<TextInput name='name' label='Name' placeholder='Name' value='' layout='fieldStyle inlineField' />);

        components.push(<Select name={'type'} label='Type' options={MODEL_TYPES} layout='fieldStyle inlineField' />);

        components.push(<TextInput name={'default'} label='Default' placeholder='Default' value='' layout='fieldStyle inlineField' />);

        components.push(<ButtonGroup name={'blank'} label='Blank' options={['True', 'False']} type='secondary' layout='fieldStyle inlineField' />);

        components.push(<NumberInput name={'max_length'} label='Max Length' layout='fieldStyle inlineField' />);

        components.push(<Button type='danger' text='X' onClick={this.removeField} />);

        return (
            <FormWithChildren defaults={this.props.field} setGlobalState={this.setGlobalState} autoSetGlobalState={true} globalStateName={'field_form'}>
                {components}
            </FormWithChildren>

        )
    }
}

export default FieldInput;
