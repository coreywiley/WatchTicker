import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables, format_date_string} from 'functions';

import {Wrapper, Header, FormWithChildren, TextInput, TableWithChildren, ListWithChildren, Paragraph, Button} from 'library';

class RequestList extends Component {
    constructor(props) {
        super(props);
        this.state = {requests: []}
        this.request_callback = this.request_callback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper('GET','/api/home/watchrequest/?related=watch', {}, this.request_callback)
    }

    request_callback(result) {
        var requests = [];
        for (var index in result) {
            requests.push(result[index]['watchrequest'])
        }

        this.setState({requests: requests})
    }

    render() {

        var requests = [];
        for (var index in this.state.requests) {
            var request = this.state.requests[index];
            requests.push(<tr>
                <td><a href={"/watchrequest/" + request.id + "/"} target="_blank">View/Edit</a></td>
                <td>{request.name}</td>
                <td>{request.watch.reference_number}</td>
                <td>{format_date_string(request.created_at, 'mm/dd/yyyy')}</td>
            </tr>)
        }

        return (<div className="container">
        <Header text={"Watch Requests"} size={2} style={{marginTop:'40px', marginBottom:'40px'}} required={""} order={"0"} />
        <Button href='/watchrequest/' text='Add New Request' type={'primary'} />
		<TableWithChildren required={""} headers={['View','Name','Reference Number', 'Request Date']} order={"3"} >
			{requests}
        </TableWithChildren>
    </div>);
    }
}
export default RequestList;
