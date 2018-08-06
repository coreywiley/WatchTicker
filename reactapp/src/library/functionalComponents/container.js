import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Container extends React.Component {
          render() {
                var content = [];
                for (var index in this.props.ComponentList) {
                    var Component = this.props.ComponentList[index];
                    var ComponentProps = this.props.ComponentProps[index];
                    content.push(<Component {...ComponentProps} />);
                }

                var style = {};
                if (this.props.css) {
                    style = this.props.css;
                }

                var containerClass = 'container-fluid';
               if (this.props.fluid == false) {
                     containerClass = 'container';
                }

                return (
                    <div style={style} className={containerClass}>{content}</div>
                );
            } 
}


export default Container;
