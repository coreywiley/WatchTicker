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
                <div className="container">

                        {(this.props.loaded) ? this.props.content : loading}

                </div>
        );
    }
}

export default Wrapper;
