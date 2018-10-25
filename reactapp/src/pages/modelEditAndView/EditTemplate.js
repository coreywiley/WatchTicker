
import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput} from 'library';

class Edit*CapitalObject* extends Component {
    constructor(props) {
        super(props);

        this.state = *Defaults*;

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount(value) {
        if(this.props.*Object*_id) {
          ajaxWrapper('GET','/api/*App*/*Object*/' + this.props.*Object*_id + '/', {}, this.objectCallback);
        }
    }

    objectCallback(result) {
      var *Object* = result[0]['*Object*'];
      course['loaded'] = true;
      this.setState(*Object*)
    }

    render() {

        *FormComponentList*

        *FormComponentProps*

        var defaults = this.state;

        var submitUrl = "/api/*App*/*Object*/";
        if (this.props.*Object*_id) {
          submitUrl += this.props.*Object*_id + '/';
        }

        var deleteUrl = undefined;
        if (this.props.*Object*_id) {
          deleteUrl = "/api/*App*/*Object*/" + this.props.*Object*_id + "/delete/";
        }


        var title = <Header text={'Create New *CapitalObject*'} size={2} />
        if (this.props.course_id) {
          title = <Header text={'Edit *CapitalObject*: ' + this.state.name} size={2} />
        }


        var content = <div className="container">
                {title}
                <Form components={Components} redirectUrl={"/*Object*/{id}"} componentProps={ComponentProps} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} />
                <br />
        </div>;

        return (
          <div>
            <Wrapper loaded={this.state.loaded} content={content} />
          </div>
             );
    }
}
export default Edit*CapitalObject*;
