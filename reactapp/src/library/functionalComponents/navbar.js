import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {Button, Json_Input} from 'library';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <Json_Input label={'Logged Out Links'} placeholder={'[["/","Home"],["/link","Link Name"]]'} name="logged_out_links" />,
                <Json_Input label={'Logged In Links'} placeholder={'[["/","Home"],["/link","Link Name"]]'} name="logged_in_links" />,
                <Json_Input label={'Admin Only Links'} placeholder={'[["/","Home"],["/link","Link Name"]]'} name="admin_links" />,

            ],
            can_have_children: true,
        }
    }

    render() {
        var user = window.cmState.getGlobalState(this, 'user')

        var classes = 'navbar navbar-expand-lg navbar-light bg-light';
        if (this.props.fixed){ classes += ' fixed-top';}

        var links = [];

        console.log("User", user)

        if (user) {
            if (user.is_staff == true) {
                for (var index in this.props.admin_links) {
                    links.push(<li key={index} className="nav-item"><a className="nav-link" href={this.props.admin_links[index][0]}>{this.props.admin_links[index][1]}</a></li>)
                }
            }
            if (this.props.logged_in_links) {
                console.log("Logged In Links", this.props.logged_in_links)
                for (var index in this.props.logged_in_links) {
                    links.push(<li key={index} className="nav-item"><a className="nav-link" href={this.props.logged_in_links[index][0]}>{this.props.logged_in_links[index][1]}</a></li>)
                }
            }
            links.push(<li key={index} className="nav-item"><a className="nav-link" href={'/logOut/'}>Log Out</a></li>)
        }
        else {
            if (this.props.logged_out_links) {
                for (var index in this.props.logged_out_links) {
                    links.push(<li key={index} className="nav-item"><a className="nav-link" href={this.props.logged_out_links[index][0]}>{this.props.logged_out_links[index][1]}</a></li>)
                }
            }
        }

        return (
            <nav className={classes} style={this.props.style}>
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
