import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

import {
    Button
} from 'library';

class TextAutocomplete extends Component {
    render() {
        var optionStyle = {
            display: "inline-block",
            border: "thin solid #ddd",
            padding: "4px 15px",
            margin: "5px",
            cursor: "pointer",
            boxShadow: "2px 2px 5px rgba(0,0,0,.1)"
        };


        var layout = '';
        if (this.props.layout) {
            layout = this.props.layout;
        }

        var options = [];
        if ('options' in this.props){
            for (var i=0; i<this.props.options.length; i++){
                var option = this.props.options[i];
                if (this.props.value != "" && option.toLowerCase().indexOf(this.props.value.toLowerCase()) > -1){
                    options.push(
                        <Button clickHandler={this.props.autocompleteSelect}
                            type="default" text={option} css={{marginLeft:"10px"}} />
                        );
                }
            }
        }

        return (
            <div>
                <div className={"form-group " + this.props.layout}>
                    <label>{this.props.label}</label>
                    <input type="text" className="form-control" name={this.props.name}
                        onChange={this.props.handlechange} value={this.props.value}
                        placeholder={this.props.placeholder} autoComplete="new-password"
                    />
                </div>

                <div>
                    {options}
                </div>
            </div>
        )


    }
}

export default TextAutocomplete;
