import React, { Component } from 'react';
import {Image} from 'library';

class Wrapper extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        var loading = <div style={{'textAlign':'center'}}> <Image css={{'width':'100px'}} src={'/static/images/loading.gif'} /></div>;
        var css = {'paddingLeft':'2px','paddingRight':'2px'};
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
