import React, { Component } from 'react';

import Wrapper from '../base/wrapper.js';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true
        };
    }

    render() {
        var content =
        <div className="col-xs-12">
            <br/><br/>
            <h1>Welcome to your own madness</h1>
            <br/><br/>

            <div>This would be a cool place to put the README.txt file</div>

            <br/><br/>
            <br/><br/>
        </div>;

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
        );
    }
}

export default Home;
