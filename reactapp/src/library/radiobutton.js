import React, { Component } from 'react';
import resolveVariables from '../base/resolver.js';

class RadioButton extends React.Component {
                render() { 
                    return ( 
                        <div>
                            <input type="radio" id={this.props.value} name={this.props.name} />
                            <label htmlFor={this.props.value}>{this.props.value}</label>
                        </div>

                    ); 
                } 
            } 


export default RadioButton;
