import React, { Component } from 'react';
import resolveVariables from '../base/resolver.js';

class NavBar extends React.Component {

    render() {
        var links = [];
        if (this.props.links) {
            for (var index in this.props.links) {
                links.push(<li key={index} className="nav-item"><a className="nav-link" href={this.props.links[index][0]}>{this.props.links[index][1]}</a></li>)
            }
        }

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <a className="navbar-brand" href={this.props.nameLink}>{this.props.name}</a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  {links}
                </ul>
              </div>
            </nav>
        );
    }
}



export default NavBar;
