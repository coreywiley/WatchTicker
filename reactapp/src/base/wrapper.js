import React, { Component } from 'react';

class Wrapper extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        var loading = <h1>Loading . . . </h1>;

        return (
            <div className="row col-sm-12">
                <div className="container">
                    <div className="row col-sm-12">

                        {(this.props.loaded) ? this.props.content : loading}

                    </div>
                </div>
            </div>
        );
    }
}

export default Wrapper;
