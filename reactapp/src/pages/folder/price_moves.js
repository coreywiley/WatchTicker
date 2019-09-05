import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables, format_date_string, format_date} from 'functions';

import {Wrapper, Header, FormWithChildren, TextInput, TableWithChildren, ListWithChildren, Paragraph, Button} from 'library';

class RequestList extends Component {
    constructor(props) {
        super(props);
        this.state = {requests: []}
        this.request_callback = this.request_callback.bind(this);
    }

    componentDidMount() {
        var today = new Date();
        var today_string = format_date(today, 'yyyy-mm-dd 00:00')

        ajaxWrapper('GET','/api/home/pricemove/?related=watch&created_at__gte=' + today_string, {}, this.request_callback)
    }

    request_callback(result) {
        var requests = [];
        for (var index in result) {
            requests.push(result[index]['pricemove'])
        }

        this.setState({requests: requests})
    }

    render() {

        var requests = [];
        for (var index in this.state.requests) {
            var request = this.state.requests[index];
            requests.push(<tr>
                <td><a href={"/watches/" + request.watch.id + "/"} target="_blank">View</a></td>
                <td>{request.watch.reference_number}</td>
                <td>${request.current_average_price.toFixed(2)}</td>
                <td>${request.previous_average_price.toFixed(2)}</td>
            </tr>)
        }

        return (<div className="container">
        <Header text={"Price Moves"} size={2} style={{marginTop:'40px', marginBottom:'40px'}} required={""} order={"0"} />
		<TableWithChildren required={""} headers={['View','Reference Number', 'Current Average Price', 'Previous Average Price']} order={"3"} >
			{requests}
        </TableWithChildren>
    </div>);
    }
}
export default RequestList;
