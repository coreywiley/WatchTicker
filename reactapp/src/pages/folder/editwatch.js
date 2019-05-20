import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, Instance, FormWithChildren, TextInput, Header} from 'library';

class EditWatch extends Component {

    render() {

        return (<div className="container">
            <Instance dataUrl={resolveVariables({"text":"/api/home/watch/{params.1}/"}, window.cmState.getGlobalState(this))["text"]} objectName={"watch"} style={{}} required={""} >
			    <FormWithChildren submitUrl={"/api/home/watch/{props.id}/"} redirectUrl={"/watch/{props.id}/"} deleteRedirectUrl={"/watches/"} defaults={{'brand': '{props.brand}', 'model': '{props.model}', 'reference_number': '{props.reference_number}'}} objectName={"watch"} style={{}} required={""} parent={"0"} >
                     <Header size={3} style={{marginTop:'40px'}} required={""} text={"Edit Watch"} parent={"1"} order={"0"} />
    				<TextInput name={"brand"} label={"Brand"} style={{}} required={""} order={"1"} parent={"1"} />
    				<TextInput name={"model"} label={"Model"} style={{}} required={""} order={"2"} parent={"1"} />
    				<TextInput name={"reference_number"} label={"Reference Number"} style={{}} required={""} order={"3"} parent={"1"} />
                </FormWithChildren>
            </Instance>
        </div>);
    }
}
export default EditWatch;
