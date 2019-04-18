import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import {Wrapper} from 'library';

import {FormWithChildren, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker} from 'library';

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
        else {
          this.setState({loaded:true})
        }
    }

    objectCallback(result) {
      var *Object* = result[0]['*Object*'];
      *Object*['loaded'] = true;
      this.setState(*Object*)
    }

    render() {

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
        if (this.props.*Object*_id) {
          title = <Header text={'Edit *CapitalObject*: ' + this.state.name} size={2} />
        }


        var content = <div className="container">
                {title}
                <FormWithChildren redirectUrl={"/*Object*/{id}/"} objectName={'*Object*'} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults}>
                *FormComponentList*
                </FormWithChildren>
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
