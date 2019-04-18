import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {ajaxWrapper} from 'functions';
import Select from "./select.js";

class BooleanInput extends Component {


    render() {

        return (
            <Select {...this.props} options={[{'value':true,'text':'True'},{'value':false,'text':'False'}]} />
        )
    }

}

export default BooleanInput;
