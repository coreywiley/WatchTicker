import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker} from 'library';

class EditComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {'component' : '', 'props' : '', 'question' : ''};

        this.objectCallback = this.objectCallback.bind(this);
    }

    componentDidMount(value) {
        if(this.props.component_id) {
          ajaxWrapper('GET','/api/home/component/' + this.props.component_id + '/', {}, this.objectCallback);
        }
        else {
          this.setState({loaded:true})
        }
    }

    objectCallback(result) {
      var component = result[0]['component'];
      component['loaded'] = true;
      this.setState(component)
    }

    render() {

				var Components = [TextInput, TextArea, Select, ];

			var component = {'name': 'component', 'label': 'Component', 'placeholder': 'Component', 'value': ''};
			var props = {'name': 'props', 'label': 'Props', 'placeholder': 'Props', 'value': ''};
			var question = {'name': 'question', 'label': 'Question', 'placeholder': 'Question', 'value': '', 'optionsUrl': '/api/home/question/', 'optionsUrlMap': {'text':'{question.unicode}','value':'{question.id}'}};
			var ComponentProps = [component, props, question];

        var defaults = this.state;

        var submitUrl = "/api/home/component/";
        if (this.props.component_id) {
          submitUrl += this.props.component_id + '/';
        }

        var deleteUrl = undefined;
        if (this.props.component_id) {
          deleteUrl = "/api/home/component/" + this.props.component_id + "/delete/";
        }


        var title = <Header text={'Create New Component'} size={2} />
        if (this.props.component_id) {
          title = <Header text={'Edit Component: ' + this.state.name} size={2} />
        }


        var content = <div className="container">
                {title}
                <Form components={Components} redirectUrl={"/component/{id}/"} objectName={'component'} componentProps={ComponentProps} deleteUrl={deleteUrl} submitUrl={submitUrl} defaults={defaults} />
                <br />
        </div>;

        return (
          <div>
            <Wrapper loaded={this.state.loaded} content={content} />
          </div>
             );
    }
}
export default EditComponent;
