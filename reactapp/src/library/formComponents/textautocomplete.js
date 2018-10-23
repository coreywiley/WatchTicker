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

        var autoCompleteStyle = {
            border: "thin solid #bbb",
            position: "absolute",
            top: "75px",
            background: "white",
            padding: "10px",
            left: "3px",
            borderRadius: "4px",
            boxShadow: "2px 2px 5px rgba(0,0,0,.2)"
        }


        var layout = '';
        if (this.props.layout) {
            layout = this.props.layout;
        }

        var options = [];
        var optionsJSX = null;
        if ('options' in this.props){
            for (var key in this.props.options){
                var value = this.props.options[key];
                var text = key.split("(")[0] + key.split(")").slice(-1);
                if (this.props.value != "" && text.toLowerCase().indexOf(this.props.value.toLowerCase()) > -1){
                    options.push(
                        <Button clickHandler={this.props.autocompleteSelect}
                            type="default" text={key} num={value} css={{marginLeft:"10px"}} />
                        );
                }
            }
        }
        if (options.length > 0){
            optionsJSX =
            <div style={autoCompleteStyle}>
                {options}
            </div>;
        }

        return (
            <div style={{position:'relative'}}>
                <div className={"form-group " + this.props.layout}>
                    <label>{this.props.label}</label>
                    <input type="text" className="form-control" name={this.props.name}
                        onChange={this.props.handlechange} value={this.props.value}
                        placeholder={this.props.placeholder} autoComplete="off"
                    />
                </div>

                {optionsJSX}
            </div>
        )


    }
}

export default TextAutocomplete;
