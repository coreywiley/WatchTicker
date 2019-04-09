import React, { Component } from 'react';
import {Wrapper} from 'library';
import {ajaxWrapper} from 'functions';
import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Card, MultiLineText, Modal} from 'library';

class DisplayEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {isHovering: false, modal: false, value: '', loaded: true, name: null}

    this.handleMouseHover = this.handleMouseHover.bind(this);
    this.toggleHoverState = this.toggleHoverState.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.setGlobalState = this.setGlobalState.bind(this);
  }

  componentDidMount() {
    this.setState({'name':this.props.name})
  }

  handleMouseHover() {
    this.setState(this.toggleHoverState);
  }

  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering,
    };
  }

  setGlobalState(name, value) {
    console.log("Set Global State", value);
    value['modal'] = false;
    this.setState(value, this.props.setGlobalState('form', value));
  }

  showModal() {
    this.setState({modal:true});
  }

  hideModal() {
    this.setState({modal:false});
  }

  render() {
    var editButton = null;
    if (this.state.isHovering) {
      editButton = <Button type={'info'} text={'Edit Name'} clickHandler={this.showModal} />
    }

    var Components = [this.props.formComponent]
    var ComponentProps = [this.props.formProps]

    var deleteUrl = null;
    var submitUrl = this.props.submitUrl;

    var defaults = this.props.defaults

    var editForm = <Form components={Components} componentProps={ComponentProps} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} objectName={this.props.objectName} globalStateName={'form'} setGlobalState={this.setGlobalState} />

    var modal = <Modal content={[editForm]} show={this.state.modal} title={'Edit Your Content On The Fly'} onHide={this.hideModal} />

    var content =
        <div
          onMouseEnter={this.handleMouseHover}
          onMouseLeave={this.handleMouseHover}
        >
            {this.props.component}
            {editButton}
            {modal}
          </div>;

    return (
        <Wrapper loaded={this.state.loaded}  content={content} />
    );

  }

}

export default DisplayEdit;

/* Example
class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {isHovering: false, modal: false, name: 'Component Name','loaded':false}
    this.componentCallback = this.componentCallback.bind(this);
    this.setGlobalState = this.setGlobalState.bind(this);
  }

  setGlobalState(name, value) {
    console.log("Set Global State", value);
    this.setState(value);
  }

  componentDidMount() {
    if (this.props.id) {
      ajaxWrapper('GET','/api/modelWebsite/component/' + this.props.id + '/', {}, this.componentCallback)
    }
  }

  componentCallback(result) {
    var component = result[0]['component'];
    component['loaded'] = true;
    this.setState(component)
  }

    render() {

      var deleteUrl = null;
      var submitUrl = '/api/modelWebsite/component/';
      if (this.props.id) {
        submitUrl = '/api/modelWebsite/component/' + this.props.id + '/';
      }
      else if (this.state.id) {
        submitUrl = '/api/modelWebsite/component/' + this.state.id + '/';
      }
      var defaults = {'name':'Hello'}

      var component = <Header size={1} text={this.state.name} />;

      var content =
        <div className="container">
          <DisplayEdit component={component} formComponent={TextInput} formProps={{'name':'name','label':'Component Name', 'placeholder':'', 'value':''}} submitUrl={submitUrl} defaults={defaults} setGlobalState={this.setGlobalState} objectName={'component'} />
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}
*/
