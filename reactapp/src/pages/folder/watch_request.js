import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, FormWithChildren, TextInput, Header, NumberInput, TextArea, Alert} from 'library';

class EditWatchRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {loaded:false, name: '', phone:'', email:'', reference_number:'', min_price:0, max_price:0, notes:'', error:''}

        this.watch_request_callback = this.watch_request_callback.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);
        this.check = this.check.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        if (this.props.id) {
            ajaxWrapper('GET','/api/home/watchrequest/' + this.props.id + '/', {}, this.watch_request_callback);
        }
        else {
            this.setState({loaded:true})
        }
    }

    watch_request_callback(result) {
        var watch_request = result[0]['watchrequest']
        watch_request['loaded'] = true;
        this.setState(watch_request)
    }

    setGlobalState(name,state) {
        this.setState(state);
    }

    check() {
        ajaxWrapper('GET','/api/home/watch/?reference_number=' + this.state.reference_number, {}, this.submit)
    }

    submit(result) {
        if (result.length == 0) {
            this.setState({error: 'There is no watch with that reference number. If you are sure this is not a typo, manually add a watch with this reference number.'})
        }
        else {
            var submitUrl = '/api/home/watchrequest/';
            if (this.props.id) {
                submitUrl += this.props.id + '/';
            }
            var watch = result[0]['watch']['id'];
            var data = this.state;
            data['watch'] = watch;
            delete data['children']

            ajaxWrapper('POST',submitUrl,data, this.route);

        }

    }

    route(result) {
        window.location = '/watchrequests/';
    }

    render() {

        var deleteUrl = null;
        if (this.props.id) {
            deleteUrl = '/api/home/watchrequest/' + this.props.id + '/delete/';
        }

        var alert = null;
        if (this.state.error != '') {
            alert = <Alert text={this.state.error} type={'danger'} />
        }

        var content = <div className="container">
			    <FormWithChildren submit={this.check} deleteRedirectUrl={"/watchrequests/"} deleteUrl={deleteUrl} defaults={this.state} objectName={"watchrequest"} setGlobalState={this.setGlobalState} autoSetGlobalState={true} globalStateName="request">
                    <Header size={3} style={{marginTop:'40px'}} required={""} text={"Watch Request"} parent={"1"} order={"0"} />
    				<TextInput name={"name"} label={"Name"} />
                    <TextInput name={"phone"} label={"Phone"} />
                    <TextInput name={"email"} label={"Email"} />
                    <TextInput name={"reference_number"} label={"Reference Number"} />
                    <NumberInput name='min_price' label='Minimum Price' />
                    <NumberInput name='max_price' label='Maximum Price (Put 0 for no max)' />
    				<TextArea name={"notes"} label={"Notes"} />
                </FormWithChildren>
                {alert}
        </div>;

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
        )
    }
}
export default EditWatchRequest;
