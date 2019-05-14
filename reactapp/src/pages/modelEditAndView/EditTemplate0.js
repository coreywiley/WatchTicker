import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import {Wrapper} from 'library';

import {FormWithChildren, TextInput, Header, If, Instance} from 'library';

class EditWatch extends Component {

    render() {

        var content = <div className="container">
            <Instance dataUrl={'/api/home/watch/' + this.props.id + '/'} objectName={'watch'}>
                <Header text={'Edit Watch: {model} {brand}'} size={2} />
                <FormWithChildren redirectUrl={"/watch/{id}/"} objectName={'watch'} deleteUrl={"/api/home/watch/{id}/delete/"} submitUrl={"/api/home/watch/{id}/"} defaults={'{state}'}>
                    <TextInput name='brand' label='Brand' />
                    <TextInput name='model' label='Model' />
                    <TextInput name='reference_number' label='Reference Number' />
                </FormWithChildren>
            </Instance>
        </div>;

        return (content);
    }
}
export default EditWatch;

/*
<If logic={[['exists', '{id}']]}>

</If>

<Header text={'Create New Watch'} size={2} />
<FormWithChildren redirectUrl={"/watch/{id}/"} objectName={"watch"} submitUrl={"/api/home/watch/"} defaults={'{state}'}>
    <TextInput name='brand' label='Brand' />
    <TextInput name='model' label='Model' />
    <TextInput name='reference_number' label='Reference Number' />
</FormWithChildren>
*/
