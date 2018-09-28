import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Navbar, Alert, Button} from 'library';

class Collaborator extends Component {
  constructor(props) {
    super(props);
    this.state = {'data':{'email':this.props.email,'markets':this.props.markets,'type':this.props.type,'projectuser':this.props.projectuser, 'project':this.props.project_id}, 'created':false, 'showForm':false}

    this.setGlobalState = this.setGlobalState.bind(this);
    this.newProjectUser = this.newProjectUser.bind(this);
    this.userCheck = this.userCheck.bind(this);
    this.createProjectUser = this.createProjectUser.bind(this);
    this.userCreated = this.userCreated.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.newProjectUserCreated = this.newProjectUserCreated.bind(this);
    this.toggleForm = this.toggleForm.bind(this);

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
      for (var item in data) {
          if (item == 'markets') {
              console.log("STRINGIFY")
              data['markets[]'] = JSON.stringify(data[item]);
          }
      }
      ajaxWrapper('POST','/api/home/projectuser/' + this.state.data['projectuser'] + '/', data, this.props.refreshData)
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
    ajaxWrapper('POST','/api/home/projectuser/', data, this.newProjectUserCreated)
  }

  newProjectUserCreated() {
    this.setState({'email':'','markets':[],'type':'','projectuser':undefined, 'project':this.props.project_id}, this.props.refreshData)
  }

  toggleForm() {
    this.setState({showForm: !this.state.showForm})
  }

  render() {
      var Components = [TextInput,Select,Select];
      var email_props = {'value':this.state.data.email,'name':'email','label':'Email:','placeholder': 'alex@agnnn.com'}
      var options = []
      for (var index in this.props.type_permission) {
        options.push({'value':this.props.type_permission[index], 'text': this.props.type_permission[index]})
      }

      var type = {'value':'','name':'type','label':'User Permission Type', 'options':options}

      var optionsUrl = '/api/home/market/';
      if (this.props.market_permissions != '') {
        var optionsUrl = '/api/home/market/?id__in=' + this.props.market_permissions;
      }

      var markets = {'value':[], 'name':'markets', 'label':'Market Permissions', 'optionsUrl':optionsUrl, 'multiple':true,'default':[], 'optionsUrlMap':{'text':['market','name'], 'value':['market','id']}}
      var ComponentProps = [email_props, type, markets];

      var defaults = {'email':this.state.data.email, 'markets':this.state.data.markets,'type':this.state.data.type, 'project':this.props.project_id, 'projectuser':this.state.data.projectuser};



      var alert = <div></div>;
      if (this.state.created) {
        if (this.props.projectuser) {
          var alert = <Alert type={'success'} text={'User Permissions Updated'} />
        }
        else {
          var alert = <Alert type={'success'} text={'New User Added To Project'} />
        }
       }

       var active = <Alert type={'success'} text={'User Activated'} />
       if (this.props.is_active == false) {
         active = <Alert type={'danger'} text={'This user has not activated their account'} />
       }

      if (this.props.projectuser) {
        var deleteUrl = '/api/home/projectuser/' + this.props.projectuser + '/delete/';
        var form = <div>
          <Form components={Components} deleteUrl={deleteUrl} componentProps={ComponentProps} refreshData={this.props.refreshData} setGlobalState={this.setGlobalState} submitFunc={this.newProjectUser} defaults={defaults} autoSetGlobalState={true} />
          {active}
          {alert}
        </div>

        if (this.state.showForm == false) {
          var form = <div></div>
        }


        var content = <div className="container">
        <div className="row">
          <div className="col-md-4">
            <p>{this.props.email}</p>
          </div>
          <div className="col-md-2">
            <p>{this.props.type}</p>
          </div>
          <div className="col-md-4">
            <p>{this.props.marketDisplay}</p>
          </div>
          <div className="col-md-2">
            <Button clickHandler={this.toggleForm} text={'Edit'} type={'info'} />
          </div>
        </div>
          {form}
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
    this.state = {'projectusers':[], 'sent':false, loaded:false, 'userType':'Support Staff', 'markets':[]}

    this.projectuserCallback = this.projectuserCallback.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.invite = this.invite.bind(this);
    this.userCallback = this.userCallback.bind(this);
    this.permissionsCallback = this.permissionsCallback.bind(this);
  }

  refreshData() {
    console.log("Refreshing Data");
    ajaxWrapper('GET','/api/home/projectuser/?related=user,markets&project=' + this.props.project_id,{}, this.projectuserCallback)
  }

  invite() {
    for (var index in this.state.projectusers) {
      var email = this.state.projectusers[index]['email'];
      var active = this.state.projectusers[index]['is_active'];
      var text = "You've been invited to a new project. <a clicktracking=off href='http://hackathon.dmiller89.webfactional.com/projectDashboard/" + this.props.project_id + "/' >Check it out.</a>";
      if (active == false) {
        text = "You've been invited to a new project on AGNNN. <a clicktracking=off href='http://hackathon.dmiller89.webfactional.com/activate/" + this.state.projectusers[index]['id'] + "/' >Please Activate Your Account Here.</a>"
      }
      ajaxWrapper('POST','/api/email/',{'from_email':'alex@flashform.io','to_email':email, 'text':text, 'subject':'Invite to AGNNN'})
    }
    this.setState({sent:true})
    window.location.href = '/projectDashboard/' + this.props.project_id +'/'
  }

  componentDidMount() {
    ajaxWrapper('GET','/users/user/',{},this.userCallback)
    this.refreshData();
  }

  userCallback(result) {
    console.log("User Callback", result);
    ajaxWrapper('GET', '/api/home/projectuser/?project=' + this.props.project_id + '&user=' + result['id'], {}, this.permissionsCallback)
  }

  permissionsCallback(result) {
    var projectuser = result[0]['projectuser']
    var market_permissions = '';
    for (var i in projectuser['markets']) {
      market_permissions += projectuser['markets'][i]['market']['id'] + ',';
    }
    this.setState({'userType':projectuser['type'], user_markets:market_permissions, loaded:true})
  }

  intersect(array1,array2) {
    return array1.filter(value => -1 !== array2.indexOf(value));
  }

  projectuserCallback(result) {
    console.log("Project User Callback",result);
    var projectusers = [];
    for (var index in result) {
      var projectuser = result[index]['projectuser']
      var markets = [];
      var marketDisplay = '';
      console.log("Project User Markets", projectuser['markets'])
      for (var i in projectuser['markets']) {
        markets.push(projectuser['markets'][i]['market']['id'])
        marketDisplay += projectuser['markets'][i]['market']['name'] + ', ';
      }
      console.log("Markets", markets);
      projectusers.push({
          'id': projectuser['user']['id'],
          'projectuser':projectuser['id'],
          'email':projectuser['user']['email'],
          'markets':markets,
          'marketDisplay':marketDisplay,
          'type':projectuser['type'],
          'is_active':projectuser['user']['is_active']
      });
    }
    this.setState({'projectusers':projectusers})
  }

    render() {
        var currentCollaborators = []
        var newProjectUserForm = <div></div>;
        for (var index in this.state.projectusers) {
          if (this.state.userType == 'Field Pro') {
            newProjectUserForm = <Collaborator key={-1} email={''} type={''} markets={[]} type_permission={['Support Staff','Field Pro']} market_permissions={this.state.user_markets} project_id={this.props.project_id} refreshData={this.refreshData} projectuser={undefined} />
            if (this.state.projectusers[index]['type'] == 'Support Staff' || this.state.projectusers[index]['type'] == 'Field Pro') {
              currentCollaborators.push(<div><Collaborator key={this.state.projectusers[index]['projectuser']} {...this.state.projectusers[index]} project_id={this.props.project_id} refreshData={this.refreshData} /><br /><br /></div>)
            }
          }
          if (this.state.userType == 'Support Staff') {
            newProjectUserForm = <Collaborator key={-1} email={''} type={''} markets={[]} type_permission={['Support Staff']} market_permissions={this.state.user_markets} project_id={this.props.project_id} refreshData={this.refreshData} projectuser={undefined} />
            if (this.state.projectusers[index]['type'] == 'Support Staff') {
              currentCollaborators.push(<div><Collaborator key={this.state.projectusers[index]['projectuser']} {...this.state.projectusers[index]} project_id={this.props.project_id} refreshData={this.refreshData} /><br /><br /></div>)
            }
          }
          else if (this.state.userType == 'Director') {
            newProjectUserForm = <Collaborator key={-1} email={''} type={''} markets={[]} type_permission={['Support Staff', 'Field Pro','Director']} market_permissions={this.state.user_markets} project_id={this.props.project_id} refreshData={this.refreshData} projectuser={undefined} />
            if (this.state.projectusers[index]['type'] == 'Support Staff' || this.state.projectusers[index]['type'] == 'Field Pro' || this.state.projectusers[index]['type'] == 'Director') {
              currentCollaborators.push(<div><Collaborator key={this.state.projectusers[index]['projectuser']} {...this.state.projectusers[index]} project_id={this.props.project_id} refreshData={this.refreshData} /><br /><br /></div>)
            }
          }
          else if (this.state.userType == 'Account Manager') {
            newProjectUserForm = <Collaborator key={-1} email={''} type={''} markets={[]} type_permission={['Support Staff','Director','Field Pro','Account Manager','Client']} market_permissions={this.state.user_markets} project_id={this.props.project_id} refreshData={this.refreshData} projectuser={undefined} />
            currentCollaborators.push(<div><Collaborator key={this.state.projectusers[index]['projectuser']} {...this.state.projectusers[index]} project_id={this.props.project_id} refreshData={this.refreshData} /><br /><br /></div>)
          }
          else if (this.state.userType == 'Client') {
            newProjectUserForm = <Collaborator key={-1} email={''} type={''} markets={[]} type_permission={['Client']} market_permissions={this.state.user_markets} project_id={this.props.project_id} refreshData={this.refreshData} projectuser={undefined} />
            if (this.state.projectusers[index]['type'] == 'Client') {
              currentCollaborators.push(<div><Collaborator key={this.state.projectusers[index]['projectuser']} {...this.state.projectusers[index]} project_id={this.props.project_id} refreshData={this.refreshData} /><br /><br /></div>)
            }
          }

        }

        var alert = <div></div>;
        if (this.state.sent == true) {
          alert = <Alert type={'success'} text={'Invites Sent'} />
        }
        var content = <div className="container">
                <h2>Add Your Collaborators</h2>
                {newProjectUserForm}

                {currentCollaborators}
                <Button clickHandler={this.invite} type={'success'} text={'Send Invites'} />
                {alert}
        </div>;

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
        );
    }
}
export default InviteCollaborators;
