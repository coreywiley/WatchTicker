import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, Instance, FormWithChildren, DateTimePicker, TextInput} from 'library';

class EditSources extends Component {

    render() {

        return (<div>		<Instance style={{}} required={""} dataUrl={resolveVariables({"text":"/api/home/source/{params.1}/"}, window.cmState.getGlobalState(this))["text"]} objectName={"source"} >
			<FormWithChildren submitUrl={"/api/home/source/{props.id}/"} redirectUrl={"/source/{props.id}/"} deleteUrl={"/api/home/source/{props.id}/delete/"} deleteRedirectUrl={"/sources/"} style={{}} required={""} defaults={{'created_at': '{props.created_at}', 'updated_at': '{props.updated_at}', 'name': '{props.name}', 'last_updated_watch': '{props.last_updated_watch}', 'last_updated_detail': '{props.last_updated_detail}'}} objectName={"source"} >
				<DateTimePicker name={"created_at"} label={"created_at"} >
</DateTimePicker>
				<DateTimePicker name={"updated_at"} label={"updated_at"} >
</DateTimePicker>
				<TextInput name={"name"} label={"name"} >
</TextInput>
				<DateTimePicker name={"last_updated_watch"} label={"last_updated_watch"} >
</DateTimePicker>
				<DateTimePicker name={"last_updated_detail"} label={"last_updated_detail"} >
</DateTimePicker>
</FormWithChildren>
</Instance></div>);
    }
}
export default EditSources;
