import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';

import {
  FormWithChildren, TextInput, Select, PasswordInput,
  Header, TextArea, NumberInput, DateTimePicker,
  ButtonGroup, Button, Accordion, LineBreak, Alert, Wrapper
} from 'library';


class RelatedInput extends Component {
    constructor(props) {
        super(props);

        this.removeField = this.removeField.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);
    }

    removeField() {
        this.props.removeField('related', this.props.index);
    }

    setGlobalState(name, state) {
        delete state['children']
        this.props.setGlobalState('related', this.props.index, state)
    }

    render() {
        var components = []
        components.push(<TextInput name={'name'} label='Name' placeholder='Name' value='' layout='fieldStyle inlineField' />);

        components.push(<Select name={'model'} label='Model' options={this.props.relatedNames} layout='fieldStyle inlineField' />);

        components.push(<TextInput name={'alias'} label='Related Name' placeholder='Alias' value='' layout='fieldStyle inlineField' />);

        components.push(<Button type='danger' text='X' onClick={this.removeField} />);

        return (<FormWithChildren defaults={this.props.field} setGlobalState={this.setGlobalState} autoSetGlobalState={true} globalStateName={'field_form'}>
            {components}
        </FormWithChildren>)
    }
}

export default RelatedInput;
