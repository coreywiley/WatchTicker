import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Navbar, Header} from 'library';

class Nav extends React.Component {
    constructor(props) {
      super(props);
      this.state = {'title':''}

      this.projectCallback = this.projectCallback.bind(this);
    }

    componentDidMount() {
      if (this.props.project_id) {
        ajaxWrapper('GET','/api/home/project/' + this.props.project_id + '/', {}, this.projectCallback)
      }
    }

    projectCallback(result) {
      console.log("ProjectCallback",result)
      this.setState({title: result[0]['project']['title']})
    }

    render() {
        var name = <div><Header size={3} text={'ARGNNN'} /></div>;
        var navbarComponent = <div></div>;
        var title = null;
        if (this.props.logged_in == true) {
          if (this.props.project_id) {
            var links = [['/projects/','Projects'],
             ['/editProject/' + this.props.project_id, 'Edit Project Details'],
             ['/projectForms/' + this.props.project_id + '/','Edit Forms'],
             ['/inviteCollaborators/' + this.props.project_id + '/','Invite Collaborators'],
             ['/projectDashboard/' + this.props.project_id + '/','Project Submissions'],
             ['/projectResults/' + this.props.project_id + '/', 'Project Results']];
             title = <Header size={2} text={'Project: ' + this.state.title} />
          }
          else {
            var links = [['/projects/','Projects']];
          }



          var nameLink = '/projects/'
          console.log("Links",links)
          var navbarComponent = <Navbar links={links} nameLink={nameLink} name={name} logOut={this.props.logOut} />

        }
        else {
          var links = [];
          var nameLink = '/'
          var navbarComponent = <Navbar links={links} nameLink={nameLink} name={name} />
        }


      return (
        <div>
          {navbarComponent}
          <div className="container">
          {title}
          </div>
        </div>
    );
    }
}


export default Nav;
