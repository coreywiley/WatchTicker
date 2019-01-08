import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Section extends React.Component {
          render() {

                var style = {'paddingTop':'100px', paddingBottom:'100px'}
                if (this.props.style) {
                  style = this.props.style;
                }

                return (
                    <section className="section" style={style}>
                      {this.props.children}
                    </section>
                );
            }
}


export default Section;
