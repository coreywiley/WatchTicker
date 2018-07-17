import React, { Component } from 'react';
import resolveVariables from '../base/resolver.js';

class Image extends React.Component {

                render() {
                    var css = {'width':'100%'}
                    if (this.props.css) {
                        css = this.props.css;
                    }

                    return (
                        <img style={css} src={this.props.src} />
                    ); 
                } 
            } 


export default Image;
