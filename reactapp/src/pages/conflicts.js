import React, { Component } from 'react';

import Wrapper from '../base/wrapper.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card} from 'library';
import ProjectCard from '../projectLibrary/projectCard.js';
import Nav from '../projectLibrary/nav.js';
import ajaxWrapper from '../base/ajax.js';

class Conflicts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            dataUrl: '',
        };

        this.userCallback = this.userCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET', '/api/user/user/' + this.props.user_id + '/',{}, this.userCallback)
    }

    userCallback(result) {
      var user = result[0]['user'];
      if (user.is_staff == true) {
        this.setState({'dataUrl':'/api/home/answer/?question=' + this.props.question_id + '&analysis_conflict=true', loaded:true})
      }
      else {
        this.setState({'dataUrl':'/api/home/answer/?analysis__user=' + this.props.user_id + '&question=' + this.props.question_id + '&analysis_conflict=true', loaded:true})
      }
    }

    render() {
        var name = <div><img src='../../static/images/AnexLogo.PNG' height="30" width="30" /><strong>ANEX</strong></div>;
        var title = <Header size={2} text={'Conflicts:'} />
        var link = '/conflict/{id}/'
        var content = <div></div>;
        if (this.state.dataUrl != '') {
        var content =
        <div>
            <Nav token={this.props.user_id} logOut={this.props.logOut} />
            <div className="container">
                <List component={Card} noDataMessage={'No Conflicts Found.'} title={title} setGlobalState={this.setGlobalState} objectName={'answer'} dataUrl={this.state.dataUrl} dataMapping={{'name':'Conflict {id}', 'link':'/conflict/{id}/', 'button_type':'primary', 'button':'View Conflict'}} />
            </div>
        </div>;
      }

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default Conflicts;
