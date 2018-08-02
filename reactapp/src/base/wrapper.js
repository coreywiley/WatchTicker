import React, { Component } from 'react';
import Image from '../library/image.js';

class Wrapper extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        var loading = <div style={{'text-align':'center'}}> <Image width={'100px'} src={'../../static/images/loading.gif'} /></div>;
        var css = {'padding-left':'2px','padding-right':'2px'};
        if (this.props.css) {
            css = this.props.css;
        }

        return (
                <div className="container-fluid" style={css}>

                        {(this.props.loaded) ? this.props.content : loading}

                </div>
        );
    }
}

export default Wrapper;
