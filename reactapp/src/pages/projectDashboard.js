import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, Button, Header} from 'library';

class Projects extends Component {
    constructor(props) {
        super(props);

        this.state = {'submissions':{}, 'project':{}, permission_markets: [], form_id: 0, 'loaded':false}

        this.submissionsCallback = this.submissionsCallback.bind(this);
        this.userCallback = this.userCallback.bind(this);

    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/projectform/?related=submissions&project_id=' + this.props.project_id, {}, this.submissionsCallback)
      ajaxWrapper('GET','/api/home/projectuser/?related=markets&project=' + this.props.project_id + '&user=' + this.props.user_id, {}, this.userCallback)
    }

    userCallback(result) {
      var markets = [];
      for (var index in result[0]['projectuser']['markets']) {
        markets.push(result[0]['projectuser']['markets'][index]['market']['id'])
      }
      this.setState({'permission_markets':markets, loaded:true})
    }

    submissionsCallback(result) {
      var submissions = {};
      for (var i in result) {
        var form = result[i]['projectform'];
        submissions[form.title] = {'submissions':[],'id':form.id};
        for (var index in form['submissions']) {
          submissions[form.title].push(form['submissions'][index]['formsubmission'])
        }
      }
      this.setState({submissions:submissions})

    }

    render() {
      var submissions = [];
      var form_id = 0;
      for (var index in this.state.submissions) {
        console.log("SUBMISSIONS", this.state.submissions[index])
        submissions.push(<Header size={4} text={'Form: ' + index} />)
        submissions.push(<Button type={'success'} text={'Add New Submission'} href={'/project/' + this.props.project_id + '/view/' + this.state.submissions[index].id + '/submission/0/'} />);
        for (var i in this.state.submissions[index]['submissions']) {
          if (this.state.permission_markets.length > 0) {
            if (this.state.permission_markets.indexOf(this.state.submissions[index]['submissions'][i]['market_id']) > -1) {
              submissions.push(<p><a href={'/projectDashboard/' + this.state.submissions[index]['submissions'][i]['id']}>{this.state.submissions[index]['submissions'][i]['searchTerm']}</a></p>)
            }
          }
          else {
            submissions.push(<p><a href={'/projectDashboard/' + this.state.submissions[index]['submissions'][i]['id']}>{this.state.submissions[index]['submissions'][i]['searchTerm']}</a></p>)
          }

        }

      }

        var content = <div className="container">
                <h2>Submissions</h2>
                {submissions}
        </div>;


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Projects;
