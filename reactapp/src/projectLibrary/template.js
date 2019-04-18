import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';
import {*component_library_imports*} from 'library';
import settings from 'base/settings.js';

class *CapitalName* extends Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                *form_components*
            ],
            can_have_children: *can_have_children*
        }
    }

    render () {

        return (
            *components*
        )
    }

}


export default *CapitalName*;
