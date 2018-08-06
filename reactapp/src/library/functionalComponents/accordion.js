import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Accordion extends React.Component {

    render() {
        var accordionSections = []
        for (var index in this.props.names) {
            var Component = this.props.ComponentList[index];
            var ComponentProps = this.props.ComponentProps[index];

            var card = <div><div className="card-header" id={"heading" + index}>
                <h5 className="mb-0">
                    <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target={"#collapse" + index} aria-expanded="true" aria-controls={"collapse" + index}>
                          {this.props.names[index]}
                    </button>
                  </h5>
                </div>
                <div className="card">
                <div id={"collapse" + index} className="collapse" aria-labelledby={"heading" + index} data-parent="#accordion">
                  <div className="card-body">
                        <Component {...ComponentProps} />
                  </div>
                </div>
              </div></div>;

              accordionSections.push(card);
        }



        return (
            <div className="accordion" id="accordion">
                {accordionSections}
            </div>
        );
    }
}

export default Accordion;
