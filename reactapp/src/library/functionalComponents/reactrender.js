import React, { Component } from 'react';
import {resolveVariables} from 'functions';
//import Playground from "component-playground";

class ReactRender extends Component {
    render() {
        var example = this.props.example;
        if (example == "") {
            example = '<Hello text="Hello!" />';
        }

        var html = this.props.html;
        console.log("HTML",html);
        if (html == "") {
            html ='class Hello extends React.Component {\n\
                render() { \n\
                    return ( \n\
                        <p>{this.props.text}</p> \n\
                    ); \n\
                } \n\
            } \n';
        }

        return (
                <div>
              <label>Render</label>
                <div className="component-documentation">
                    {/*<Playground codeText={html + ' ReactDOM.render(' + example + ', mountNode);'} noRender={false} scope={this.props.scope} />*/}
                </div>

              <div id='mountNode'>

              </div>
              </div>
        )


    }
}

export default ReactRender;
