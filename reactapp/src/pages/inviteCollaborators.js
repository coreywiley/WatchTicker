import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, Alert, Button} from 'library';

class Collaborator extends Component {
  constructor(props) {
    super(props);
    this.state = {'data':{'email':this.props.email,'markets':this.props.markets,'type':this.props.type,'projectuser':this.props.projectuser, 'project':this.props.project_id}, 'created':false}

    this.setGlobalState = this.setGlobalState.bind(this);
    this.newProjectUser = this.newProjectUser.bind(this);
    this.userCheck = this.userCheck.bind(this);
    this.createProjectUser = this.createProjectUser.bind(this);
    this.userCreated = this.userCreated.bind(this);
    this.refreshData = this.refreshData.bind(this);

  }

  refreshData() {
    this.setState({'created':true})
  }

  setGlobalState(name, data) {
    console.log("Setting Global State To",data);
    this.setState({data:data})
  }

  newProjectUser(data) {
    console.log("Data",data);
    if (data['projectuser']) {
      ajaxWrapper('POST','/api/home/projectuser/' + this.state.data['projectuser'] + '/', data, this.refreshData)
    }
    else {
      //check if user already exists
      ajaxWrapper('GET','/api/user/user/?email=' + this.state.data['email'], {}, this.userCheck)
    }

  }

  userCheck(result) {
    console.log("User Check", result)
    var user = undefined;
    if (result.length > 0) {
      user = result[0]['user']['id']
      this.createProjectUser(user)
    }
    else {
      ajaxWrapper('POST','/api/user/user/',{'email':this.state.data.email, 'is_active':false}, this.userCreated)
    }
  }

  userCreated(result) {
    console.log("User Created", result)
    var user = result[0]['user']['id']
    this.createProjectUser(user);
  }

  createProjectUser(user) {
    console.log("Create Project User", user)
    var data = this.state.data;
    data['user'] = user;
    console.log("Project User Request", data);
    for (var item in data) {
        if (item == 'markets') {
            console.log("STRINGIFY")
            data['markets[]'] = JSON.stringify(data[item]);

        }
    }

    ajaxWrapper('POST','/api/home/projectuser/', data, this.refreshData)
  }

  render() {
      var Components = [TextInput,Select,Select];
      var email_props = {'value':this.state.data.email,'name':'email','label':'Email:','placeholder': 'alex@agnnn.com'}
      var type = {'value':'','name':'type','label':'User Permission Type', 'options':[{'value':'Support Staff','text':'Support Staff'},
       {'value':'Account Manager','text':'Account Manager'}, {'value':'Field Pro','text':'Field Pro'}, {'value':'Client', 'text':'Client'},{'value':'Director','text':'Director'}]}

      var markets = {'value':[], 'name':'markets', 'label':'Market Permissions', 'optionsUrl':'/api/home/market/', 'multiple':true,'default':[], 'optionsUrlMap':{'text':['market','name'], 'value':['market','id']}}
      var ComponentProps = [email_props, type, markets];

      var defaults = {'email':this.state.data.email, 'markets':this.state.data.markets,'type':this.state.data.type, 'project':this.props.project_id, 'projectuser':this.state.data.projectuser};



      var alert = <div></div>;
      if (this.state.created) {
        var alert = <Alert type={'success'} text={'New User Added To Project'} />
       }

       var active = <Alert type={'success'} text={'User Activated'} />
       if (this.props.is_active == false) {
         active = <Alert type={'danger'} text={'This user has not activated their account'} />
       }

      if (this.props.projectuser) {
        var deleteUrl = '/api/home/projectuser/' + this.props.projectuser + '/delete/';
        var content = <div className="container">
                <Form components={Components} deleteUrl={deleteUrl} componentProps={ComponentProps} refreshData={this.props.refreshData} setGlobalState={this.setGlobalState} submitFunc={this.newProjectUser} defaults={defaults} autoSetGlobalState={true} />
                {active}
                {alert}
        </div>;
      }
      else {
        var content = <div className="container">
                <Form components={Components} componentProps={ComponentProps} refreshData={this.props.refreshData} setGlobalState={this.setGlobalState} submitFunc={this.newProjectUser} defaults={defaults} autoSetGlobalState={true} />
                {alert}
        </div>;
      }



      return (
          <Wrapper loaded={true} content={content} />
      );
  }
}


class InviteCollaborators extends Component {
  constructor(props) {
    super(props);
    this.state = {'projectusers':[], 'sent':false}

    this.projectuserCallback = this.projectuserCallback.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.invite = this.invite.bind(this);
  }

  refreshData() {
    console.log("Refreshing Data");
    ajaxWrapper('GET','/api/home/projectuser/?related=user,markets&project=' + this.props.project_id,{}, this.projectuserCallback)
  }

  invite() {
    for (var index in this.state.projectusers) {
      var email = this.state.projectusers[index]['email'];
      var active = this.state.projectusers[index]['is_active'];
      var text = "You've been invited to a new project. Check it out here.";
      if (active == false) {
        text = "You've been invited to a new project on AGNNN. Please Activate Your Account Here."
      }
      ajaxWrapper('POST','/api/email/',{'from_email':'jeremy.thiesen1@gmail.com','to_email':email, 'text':text, 'subject':'Invite to AGNNN'})
    }
    this.setState({sent:true})
  }

  componentDidMount() {
    this.refreshData();
  }

  projectuserCallback(result) {
    console.log("Project User Callback",result);
    var projectusers = [];
    for (var index in result) {
      var projectuser = result[index]['projectuser']
      var markets = [];
      for (var i in projectuser['markets'][i]) {
        markets.push(projectuser['markets'][i]['market']['id'])
      }
      projectusers.push({'projectuser':projectuser['id'], 'email':projectuser['user']['email'], 'markets':markets, 'type':projectuser['type'], 'is_active':projectuser['user']['is_active']});
    }
    this.setState({'projectusers':projectusers})
  }

    render() {
        var currentCollaborators = []

        for (var index in this.state.projectusers) {
          currentCollaborators.push(<div><Collaborator {...this.state.projectusers[index]} project_id={this.props.project_id} refreshData={this.refreshData} /><br /><br /></div>)
        }

        var alert = <div></div>;
        if (this.state.sent == true) {
          alert = <Alert type={'success'} text={'Invites Sent'} />
        }
        var content = <div className="container">
                <h2>Add Your Collaborators</h2>
                {currentCollaborators}
                <Collaborator email={''} type={''} markets={[]} project_id={this.props.project_id} refreshData={this.refreshData} projectuser={undefined} />
                <Button clickHandler={this.invite} type={'success'} text={'Send Invites'} />
                {alert}
        </div>;

        return (
            <Wrapper loaded={true} content={content} />
        );
    }
}
export default InviteCollaborators;
