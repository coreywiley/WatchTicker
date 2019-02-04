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
        var style = {'paddingLeft':'0px','paddingRight':'0px'};
        if (this.props.css) {
            style = this.props.css;
        } else if (this.props.style) {
            style = this.props.style;
        }

        if (!this.props.loaded) {
          style['marginTop'] = '50px'
        }

        return (
                <div className="container-fluid" style={style}>
                        {(this.props.loaded) ? this.props.content : loading}
                </div>
        );
    }
}

export default Wrapper;
