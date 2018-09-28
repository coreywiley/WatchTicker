import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, Button, Header, Card} from 'library';

class Projects extends Component {
    constructor(props) {
        super(props);

        this.state = {'forms':{}, 'project':{}, permission_markets: [], form_id: 0, 'loaded':false}

        this.formsCallback = this.formsCallback.bind(this);
        this.userCallback = this.userCallback.bind(this);

    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/projectform/?related=submissions,elements&project_id=' + this.props.project_id, {}, this.formsCallback)
      ajaxWrapper('GET','/api/home/projectuser/?related=markets&project=' + this.props.project_id + '&user=' + this.props.user_id, {}, this.userCallback)
    }

    userCallback(result) {
      var markets = [];
      for (var index in result[0]['projectuser']['markets']) {
        markets.push(result[0]['projectuser']['markets'][index]['market']['id'])
      }
      this.setState({'permission_markets':markets, loaded:true})
    }

    formsCallback(result) {
      var forms = {};
      for (var i in result) {
        var form = result[i]['projectform'];

        var submissions = [];
        for (var index in form['submissions']) {
          submissions.push(form['submissions'][index]['formsubmission']);
        }

        forms[form.id] = form;
        forms[form.id]['submissions'] = submissions;
      }
      this.setState({forms:forms})

    }

    render() {
      var forms = [];
      var form_id = 0;
      for (var index in this.state.forms) {
        console.log("SUBMISSIONS", this.state.forms[index])
        var form = this.state.forms[index];
        forms.push(<Header size={4} text={'Form: ' +  form['title']} />)
        forms.push(<Button type={'success'} text={'Add New Submission'} href={'/project/' + this.props.project_id + '/view/' + index + '/submission/0/'} />);

        for (var i in form['submissions']) {
            var submission = form['submissions'][i];
            var date = new Date(submission['updated']);
            var completed = 0;
            for (var key in submission['data']){
                if (!isNaN(parseInt(key)) || key == 'address'){ completed += 1;}
            }

            var total = form['elements'].length;

            var desc = completed + " of " + total + " questions answered.  Last updated : " + date;

            if (this.state.permission_markets.length > 0) {
                if (this.state.permission_markets.indexOf(submission['market_id']) > -1) {
                    forms.push(
                        <Card link={'/project/' + this.props.project_id + '/view/' + index + '/submission/' + submission['id'] + '/'}
                        button={'Edit'} button_type={'primary'} name={submission['searchTerm']} description={desc} />
                    );
                }
            }
            else {
                forms.push(
                    <Card deleteUrl={'/api/home/formsubmission/' + submission['id'] + '/delete/'}
                    link={'/project/' + this.props.project_id + '/view/' + index + '/submission/' + submission['id'] + '/'}
                    button={'Edit'} button_type={'primary'} name={submission['searchTerm']} description={desc} />
                );
            }

        }

      }

        var content = <div className="container">
                <h2>Submissions</h2>
                {forms}
        </div>;


        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Projects;
