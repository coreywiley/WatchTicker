import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';
import ajaxWrapper from "base/ajax.js";
import Select from "./select.js";

class BooleanInput extends Component {


    render() {

        return (
            <Select {...this.props} options={[{'value':true,'text':'True'},{'value':false,'text':'False'}]} />
        )
    }

}

export default BooleanInput;
