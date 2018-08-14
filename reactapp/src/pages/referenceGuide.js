import React, { Component } from 'react';

import Wrapper from '../base/wrapper.js';
import ajaxWrapper from '../base/ajax.js';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Icon, Table} from 'library';
import {isMobile} from 'react-device-detect';
import Nav from '../projectLibrary/nav.js';

class ReferenceGuide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            question: {id:0,project_id:0,name:'',question_text:'',options:[]},
        };

        this.getQuestionData = this.getQuestionData.bind(this);
        this.questionCallback = this.questionCallback.bind(this);
        this.getQuestionData();
    }

    setGlobalState() {

    }

    getQuestionData() {
        ajaxWrapper("GET",  "/api/home/question/" + this.props.question_id + "/", {}, this.questionCallback);
    }

    questionCallback(value) {
        if (value['error']) {
          window.location.href = '/projects/';
        }
        else {
          console.log("Return Value!", value);
          this.setState({question:value[0]['question'], loaded:true});
        }
    }

    render() {
        var name = <div><img src='../../static/images/AnexLogo.PNG' height="30" width="30" /><strong>ANEX</strong></div>;
        var questionName = 'Question: ' + this.state.question.name;
        var css = {};
        var answerProps = {'name':'response', 'value':''}
        var defaults = {'response':'', 'question':this.props.question_id, 'sid':this.props.user_id}
        var submitUrl = '/api/home/answer/';
        var redirectUrl = '/referenceGuide/' + this.props.question_id + '/';
        var title= <span><strong>AN</strong>ALYSIS OF <strong>EX</strong>PLANATIONS: {this.state.question.name}</span>;
        var content =
        <div>
            <Nav token={this.props.user_id} logOut={this.props.logOut} />
            <div className="container" style={css}>
                <Header size={'2'} text={title} />
                <Header size={'3'} text={'General Rubric Categories for Analysis of Student Work'} />
                <br />
                <Header size={'4'} text={questionName} />
                <Paragraph text={this.state.question.text} />
                <br />
                <Paragraph text={<strong>Purpose</strong>} />
                <Paragraph text={'This item gives students the opportunity to communicate their reasoning about how they approach this puzzle given to them by their friend. The purpose of this item is to encourage students to think about how, knowing what they know (skateboards have 4 wheels, bikes have 2 and there are 22 wheels), they can prove whether or not there is at least one bike in the store.'} />
                <Paragraph text={<strong>Expectations</strong>} />
                <Paragraph text={'We are looking for an explanation that acknowledges there must be a bike in the store because of the fact that the number of wheels is not a multiple of 4 (skateboard) and thus the remaining 2 wheels proves there must be bike in the store. Whether they repeat add/subtract or think of multiples, there are a variety of approaches students can take to figure out and explain how they know there is a bike in the store.Of course, there could be more than one bike, but we are looking for an explanation that argues how there must be at least one based on the hint from Sam.'} />
                <Paragraph text={<strong>Generic Growth/Feedback/Revision Rubric:</strong>} />
                <Table headers={['Analysis','Comments']} data={[['2: At Grade level','No signification changes required'],['1: Approaching Grade Level','Minor revisions required (Are there one or two concrete feedback questions that could likely produce an acceptable revision?)'],['0: Lack of Evidence','Major Revisions Required']]} />
                <Paragraph text={<strong>What categories would inform, in concrete ways, the teacher’s instructional decisions regarding next steps in helping students?</strong>} />
                <Paragraph text={'IMPORTANT NOTE: We are NOT looking for categories of evidence of understanding. That is a separate purpose. Obviously, if a student doesn’t understand the item then they will not be able to write a viable explanation. However, it is often the case that a student writes something (typically a calculation or answer) that provides evidence that they understand the item but their response does not count as an explanation. The purpose of this categorization is only to analyze explanations.'} />
                <Paragraph text={<strong>The responses to the questions are either Answers(A) or Explanations(E).</strong>} />
                <Paragraph text={"A's are simple answer responses, either 1 if correct or 0 if incorrect. Usually these are auto-scored."} />
                <Paragraph text={"E's are explanation responses that fall into the following bins: NA, 0, 1N, 1M, 1L, 2, 2! These are the types of items you will be scoring."} />
                <Table headers={['0','1N','1M','1L','2']} data={[['Lack of Evidence/Major revisions needed','No connection to context','Mathematical misconceptions','Logic incomplete','Grade level explanation/no significant revisions']]} />
                <Paragraph text={<strong>Which bin does it go in?</strong>} />
                <Paragraph text={"0's will generally be very poorly constructed and will lack any real legitimate value of an explanation. If there is little to nothing to be taken from it, it's a 0."} />
                <Paragraph text={<span>The 1's all fall into our incomplete category. Perhaps all the info is there but it's lacking context, no units or connection to the problem, that's a <strong>1N, not connected to context.</strong> If the context is present and logically follows but there is a mathematical error then it's a <strong>1M, mathematical misconception.</strong> If the explanation has the units and context of the problem and the mathematics are correct but seems to be missing a concluding piece or has other gaps, we call that a <strong>1L, incomplete logic.</strong> If their explanation is a little bit in both categories then mark it with whichever you think would be most useful for a teacher to address.</span>} />
                <Paragraph text={"Lastly if it's an OK or good grade level answer with little to no errors, it's a 2."} />
                <Header size={'4'} text={'Unpacking the bins'} />

                <Header size={'5'} text={'Bin NA: No Attempt'} />
                <Paragraph text={"It is useful to separate out responses that show evidence of the student not making any serious attempt. Our forms do not allow students to leave an item blank, so they have to write something. NA = 'No Attempt.' This is to indicate students that did not show any evidence of trying or attempting the item."} />
                <Table headers={['Student Explanation','Rationale']} dataUrl={'/api/home/answer/?question=' + this.props.question_id + '&admin_answer=NA'} dataMapping={['{response}','{admin_comment}']} objectName={'answer'} />

                <Header size={'5'} text={'Bin 0: Major Revisions Required'} />
                <Paragraph text={"0 = An attempt that is significantly mathematically or logically flawed or makes no sense. OR, if it is missing 2 components (context, logic, math). "} />
                <Table headers={['Student Explanation','Rationale']} dataUrl={'/api/home/answer/?question=' + this.props.question_id + '&admin_answer=0'} dataMapping={['{response}','{admin_comment}']} objectName={'answer'} />

                <Header size={'5'} text={'Bin 1: Minor Revisions Required'} />
                <Paragraph text={"This is the bin where you imagine the student in front of you and you are able to ask one or two feedback questions that you feel would enable the student to revise their response to produce an acceptable, grade level explanation."} />
                <Paragraph text={"We have identified three main categories of ways that students fall short of grade level. As a teacher, it would be useful to know which students were in which of these categories. The categories are:"} />
                <Paragraph text={<strong>No connection to context (1N)</strong>} />
                <Paragraph text={<strong>Mathematical Misconceptions (1M)</strong>} />
                <Paragraph text={<strong>Incomplete logic (1L)</strong>} />
                <Paragraph text={"Or students might have a mathematical misconception that is clouding their explanation. Below are examples of each category."} />

                <Header size={'5'} text={'Category 1N: No Connections with the Context'} />
                <Paragraph text={"Items in this bin lack context and are usually just a string of calculations. Often they are the appropriate calculations in regards to the problem, but we are looking for the student explanation to connect them to the context of the problem."} />
                <Table headers={['Student Explanation','Rationale']} dataUrl={'/api/home/answer/?question=' + this.props.question_id + '&admin_answer=1N'} dataMapping={['{response}','{admin_comment}']} objectName={'answer'} />

                <Header size={'5'} text={'Category 1L: Logically Incomplete'} />
                <Paragraph text={"Items in this bin have gaps in the logical flow of the argument or are incomplete. This includes responses that lack a conclusion to support their claim or that ignore a critical step in their process to help us understand their explanation. "} />
                <Table headers={['Student Explanation','Rationale']} dataUrl={'/api/home/answer/?question=' + this.props.question_id + '&admin_answer=1L'} dataMapping={['{response}','{admin_comment}']} objectName={'answer'} />

                <Header size={'5'} text={'Category 1M: Major Revisions Required'} />
                <Paragraph text={"Items in this bin have some kind of mathematical misconception that is clouding their explanation."} />
                <Table headers={['Student Explanation','Rationale']} dataUrl={'/api/home/answer/?question=' + this.props.question_id + '&admin_answer=1M'} dataMapping={['{response}','{admin_comment}']} objectName={'answer'} />

                <Header size={'5'} text={'Bin 2: No significant revisions required'} />
                <Paragraph text={"This bin includes responses that we consider acceptable as a grade level explanation. It is important to understand that a Category 2 does not mean “perfect.” There are almost always ways to improve an argument. What we are looking for is an explanation that connects to the context, is mathematically valid, and flows logically, including a conclusion."} />
                <Paragraph text={"Note regarding typos (transcription errors, small arithmetic errors): If it appears that a small calculation error occurred and it does not significantly change the structure of the mathematics, then a response can still be eligible for a 2."} />
                <Table headers={['Student Explanation','Rationale']} dataUrl={'/api/home/answer/?question=' + this.props.question_id + '&admin_answer=2'} dataMapping={['{response}','{admin_comment}']} objectName={'answer'} />

                <Header size={'2'} text={'Next Steps'} />
                <Paragraph text={"When you are ready, click Start Analyzing to analyze our calibration test responses."} />
                <Button type='success' text={'Start Analyzing'} href={'/trialQuestion/' + this.props.question_id +'/'} />

            </div>
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default ReferenceGuide;
