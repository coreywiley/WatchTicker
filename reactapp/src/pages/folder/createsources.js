import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, FormWithChildren, DateTimePicker, TextInput} from 'library';

class CreateSources extends Component {

    render() {

        return (<div>		<FormWithChildren style={{}} required={""} submitUrl={"/api/home/source/"} objectName={"source"} redirectUrl={"/source/{id}/"} >
</FormWithChildren></div>);
    }
}
export default CreateSources;
