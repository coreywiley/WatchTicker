import React, { Component } from 'react';
import resolveVariables from '../base/resolver.js';
import Container from '../library/container.js';
import Header from '../library/header.js';
import Paragraph from '../library/paragraph.js';
import ButtonGroup from '../library/buttongroup.js';
import TextArea from '../library/textarea.js';
import Form from '../library/form.js';

import ajaxWrapper from '../base/ajax.js';
import {isMobile} from 'react-device-detect';

class GradeContainer extends React.Component {
            constructor(props) {
            super(props);
            this.state = {
                loaded: true,
                user_id: this.props.user_short_name,
                question_name: this.props.question_name,
                user_score: this.props.user_score,
                student_response: this.props.student_response,
                options: this.props.options,
                student_id: this.props.student_id,
                user_comment: this.props.user_comment,
                saved: false,
            };

            this.handleChange = this.handleChange.bind(this);
            this.save = this.save.bind(this);
            this.saveCallback = this.saveCallback.bind(this);
        }

        handleChange = (e) => {

           var name = e.target.getAttribute("name");
           var newState = {};
           newState[name] = e.target.value;
           console.log("handlechange",name,newState)

            if (name == 'user_score') {
                this.setState(newState, this.save);
            }
            else {
                newState['saved'] = false;
                this.setState(newState);
            }

        }

        save() {
            var data = this.state;
            ajaxWrapper("POST", "/submitGrade/1/", data, this.saveCallback);

        }

        saveCallback(value) {
            this.setState({saved:true},this.props.saveGrade(this.state))
        }

          render() {

                var header1Props = {'size':5,'text':'Response'}


                var Paragraph1Props = {'text': this.state.student_response}


                var header2Props = {'size':5,'text':'Analysis'}
                var buttonGroupProps = {'handlechange':this.handleChange, 'options':this.props.options,'name':'user_score', 'type':'primary', 'value':this.state.user_score}


                var header3Props = {'size':5,'text':'Comments'}
                var textareaProps = {'name':'user_comment','value':this.state.user_comment, 'handlechange':this.handleChange}

                var data1 ={'ComponentList':[Paragraph],
                'ComponentProps':[Paragraph1Props]};

                var data2 = {'ComponentList':[Header,ButtonGroup,Header,TextArea],
                'ComponentProps':[header2Props,buttonGroupProps,header3Props,textareaProps]};

                var saved = <div></div>
                if (this.state.saved == true) {
                    saved = <div className="alert alert-success" role="alert">
                          Saved
                        </div>
                }

                var css = {};
                if (isMobile) {
                    css = {'height':'200px','overflow-y':'scroll'}
                }

                return (
                    <div>
                        <div style={css}>
                            <Container {...data1} />
                        </div>
                        <Container {...data2} />
                        <button onClick={this.save} className="btn btn-primary">Save</button>
                        <button onClick={() => this.props.changeCurrentIndex(-1)} className="btn btn-info" style={{'margin':'5px'}}>Previous</button>
                        <button onClick={() => this.props.changeCurrentIndex(1)} className="btn btn-info">Next</button>
                        {saved}
                    </div>
                );
            }
}


export default GradeContainer;