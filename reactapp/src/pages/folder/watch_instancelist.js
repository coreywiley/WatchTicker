import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, ListWithChildren, Header, Button} from 'library';

class Watch_InstanceList extends Component {

    render() {

        return (<div>		<ListWithChildren style={{}} required={""} dataUrl={"/api/home/watch_instance/"} objectName={"watch_instance"} >
			<Header size={3} style={{}} required={""} text={"Watch_Instance: undefined"} >
</Header>
			<Button type={"primary"} text={"Edit"} style={{}} required={""} href={"/editWatch_Instance/undefined/"} >
</Button>
			<Button type={"primary"} text={"View"} style={{}} required={""} href={"/watch_instance/undefined/"} >
</Button>
</ListWithChildren></div>);
    }
}
export default Watch_InstanceList;
