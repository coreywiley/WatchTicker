import React, { Component } from 'react';
import {resolveVariables} from 'functions';

//Example
//var questionName = 'Question: ' + this.state.question.name;
//var questionText = {'text': this.state.question.text}
//var responseName = 'Response ' + this.state.answer.id;
//var responseText = {'text':this.state.answer.response}
//<Accordion names={[questionName, responseName]} open={[true,true]} ComponentList={[Paragraph, Paragraph]} ComponentProps={[questionText, responseText]} multiple={true} />


class Accordion extends React.Component {

    render() {
        var accordionSections = []
        for (var index in this.props.names) {
            var Component = this.props.ComponentList[index];
            var ComponentProps = this.props.ComponentProps[index];
            var dataParent = '#accordion';
            if (this.props.multiple == true) {
              dataParent = '#accordion-' + index;
            }
            var collapsed = 'collapsed collapse';
            if (this.props.open[index] == true) {
                collapsed += ' show';
            }


            var card = <div><div className="card-header" id={"heading" + index}>
                <h4 className="mb-0" style={{textAlign:'left'}}>
                    <button className={'btn btn-link collapsed'} type="button" data-toggle="collapse" data-target={"#collapse" + index} aria-expanded="true" aria-controls={"collapse" + index}>
                          {this.props.names[index]}
                    </button>
                </h4>
                </div>
                <div className="card">
                <div id={"collapse" + index} className={collapsed} aria-labelledby={"heading" + index} data-parent={dataParent}>
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
