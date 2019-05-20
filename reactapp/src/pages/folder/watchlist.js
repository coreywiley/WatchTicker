import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, Header, FormWithChildren, TextInput, TableWithChildren, ListWithChildren, Paragraph, Button} from 'library';

class WatchList extends Component {

    render() {

        return (<div className="container">
        <Header text={"Watch List"} size={2} style={{marginTop:'40px', marginBottom:'40px'}} required={""} order={"0"} />

		<FormWithChildren autoSetGlobalState={"true"} globalStateName={"filter"} style={{}} required={""} row={"true"} >
			<TextInput name={"brand"} label={"Brand"} style={{}} required={""} layout={"col-4"} />
			<TextInput name={"model"} label={"Model"} style={{}} required={""} layout={"col-4"} />
			<TextInput name={"reference_number"} label={"Reference Number"} style={{}} required={""} layout={"col-4"} />
        </FormWithChildren>
		<TableWithChildren required={""} headers={['Brand', 'Model', 'Ref #', 'View', 'Edit']} order={"3"} >
			<ListWithChildren limit={10} dataUrl={"/api/home/watch/"} objectName={"watch"} filters={resolveVariables({"text":{'model__icontains': '{filter.model}', 'brand__icontains': '{filter.brand}', 'reference_number__icontains': '{filter.reference_number}'}}, window.cmState.getGlobalState(this))["text"]} style={{}} required={""} table={"true"} >
				<Paragraph text={"{props.brand}"} style={{}} required={""} />
				<Paragraph text={" {props.model}"} style={{}} required={""} />
				<Paragraph text={"{props.reference_number}"} style={{}} required={""} />
                <Button text={"View"} href={"/watch/{props.id}/"} style={{}} required={""} type={"primary"} />
				<Button text={"Edit"} style={{}} required={""} href={"/editWatch/{props.id}/"} type={"info"} />
            </ListWithChildren>
        </TableWithChildren>
    </div>);
    }
}
export default WatchList;
