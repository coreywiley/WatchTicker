import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables, format_date_string} from 'functions';

import {Wrapper, Header, FormWithChildren, TextInput, TableWithChildren, ListWithChildren, Paragraph, Button} from 'library';

class SourceList extends Component {
    constructor(props) {
        super(props);
        this.state = {sources: []}
        this.source_callback = this.source_callback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper('GET','/api/home/source/', {}, this.source_callback)
    }

    source_callback(result) {
        var sources = [];
        for (var index in result) {
            sources.push(result[index]['source'])
        }

        this.setState({sources: sources})
    }

    render() {

        var source_html = [];
        for (var index in this.state.sources) {
            var source = this.state.sources[index];
            source_html.push(<tr>
                <td>{source.name}</td>
                <td>{format_date_string(source.last_updated_watch, 'mm/dd/yyyy HH:MM')}</td>
                <td>{format_date_string(source.last_updated_detail, 'mm/dd/yyyy HH:MM')}</td>
            </tr>)
        }

        return (<div className="container">
        <Header text={"Sources"} size={2} style={{marginTop:'40px', marginBottom:'40px'}} required={""} order={"0"} />

		<TableWithChildren required={""} headers={['Source', 'Watch Update', 'Price Update']} order={"3"} >
			{source_html}
        </TableWithChildren>
    </div>);
    }
}
export default SourceList;
