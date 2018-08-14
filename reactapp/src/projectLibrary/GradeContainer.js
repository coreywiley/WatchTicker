import React, { Component } from 'react';
import resolveVariables from '../base/resolver.js';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, ButtonGroup, Alert} from 'library';

import ajaxWrapper from '../base/ajax.js';
import {isMobile} from 'react-device-detect';

class GradeContainer extends React.Component {
            constructor(props) {
            super(props);
            this.state = {
                loaded: true,
                user_id: this.props.user_short_name,
                question_name: this.props.question_name,
                score: this.props.score,
                student_response: this.props.student_response,
                options: this.props.options,
                student_id: this.props.student_id,
                comment: this.props.comment,
                saved: false,
                answer: this.props.answer,
                user: this.props.userId,
                analysis_id: this.props.analysis_id,
                admin_answer: this.props.admin_answer,
                admin_comment: this.props.admin_comment,
                match: false,
                comment_visible: false,
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

            if (name == 'score') {
              if (this.state.admin_answer) {
                if (newState[name] == this.state.admin_answer) {
                  newState['match'] == true;
                }
                else {
                  newState['match'] == false;
                }
                newState['comment_visible'] = true;
              }
              this.setState(newState, this.save);
            }
            else {
                newState['saved'] = false;
                this.setState(newState);
            }

        }

        save() {
            var data = this.state;
            if (this.state.analysis_id) {
              ajaxWrapper("POST", "/api/home/analysis/" + this.state.analysis_id + "/", data, this.saveCallback);
            }
            else {
              ajaxWrapper("POST", "/api/home/analysis/", data, this.saveCallback);
            }
        }

        saveCallback(value) {
            console.log("Saved",value);
            this.setState({saved:true},this.props.saveGrade(value[0]['analysis']))
        }

          render() {

            var alert = <div></div>;
            if (this.state.comment_visible == true) {
              var type = 'danger';
              if (this.state.match == true) {
                type = 'success';
              }
              alert = <Alert text={'Answer: ' + this.state.admin_answer + '. Explanation: ' + this.state.admin_comment} type={type} />
            }

                var header1Props = {'size':5,'text':'Response'}


                var Paragraph1Props = {'text': this.state.student_response}


                var header2Props = {'size':5,'text':'Analysis'}
                var buttonGroupProps = {'handlechange':this.handleChange, 'options':this.props.options,'name':'score', 'type':'primary', 'value':this.state.score}


                var header3Props = {'size':5,'text':'Comments'}
                var textareaProps = {'name':'comment','value':this.state.comment, 'handlechange':this.handleChange}

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
                        {alert}
                        <button onClick={this.save} className="btn btn-primary">Save</button>
                        <button onClick={() => this.props.changeCurrentIndex(-1)} className="btn btn-info" style={{'margin':'5px'}}>Previous</button>
                        <button onClick={() => this.props.changeCurrentIndex(1)} className="btn btn-info">Next</button>
                        {saved}
                    </div>
                );
            }
}


export default GradeContainer;
