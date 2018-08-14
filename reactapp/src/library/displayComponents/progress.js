import React, { Component } from 'react';

class Progress extends React.Component {
    render() {
        return (
            <div style={this.props.css} className="progress">
              <div className="progress-bar bg-success" role="progressbar" style={{'width':this.props.pct_complete + '%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{this.props.pct_complete + '%'}</div>
            </div>
        );
    }
}

export default Progress;
