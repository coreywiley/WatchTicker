import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {Div, NumberInput, CSSInput, AddChildComponent} from 'library';

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                
                <CSSInput label={'css'} name={'style'} default={{}} />,
            ],
            can_have_children: true,
        }
    }
    
    render() {
                var className = "container ";
                if (this.props.className) {
                  className += this.props.className;
                }

                return (
                    <Div className={className} style={this.props.style}>
                      {this.props.children}
                    </Div>
                );
            }
}


export default Container;
