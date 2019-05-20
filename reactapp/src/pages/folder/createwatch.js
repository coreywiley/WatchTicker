import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, FormWithChildren, DateTimePicker, TextInput} from 'library';

class CreateWatch extends Component {

    render() {

        return (<div>		<FormWithChildren style={{}} required={""} submitUrl={"/api/home/watch/"} objectName={"watch"} redirectUrl={"/watch/{id}/"} >
</FormWithChildren></div>);
    }
}
export default CreateWatch;
