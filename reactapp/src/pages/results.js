import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from "base/ajax.js";

import {
    Accordion, Button
} from 'library';

var PieChart = require("react-chartjs").Pie;

var CHARTCOLORS = [
{
      color:"#F7464A",
      highlight: "#FF5A5E"
  },
  {
      color: "#46BFBD",
      highlight: "#5AD3D1"
  },
  {
      color: "#FDB45C",
      highlight: "#FFC870"
  },
  {
      color: "#949FB1",
      highlight: "#A8B3C5"
  },
  {
      color: "#4D5360",
      highlight: "#616774"
  }
];


class ResultPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {},
            elements: {},
            loaded: true,
        };
    }

    componentDidMount() {
        this.getForm();
    }

    getForm() {
        var url = "/api/home/projectform/" + this.props.id + "/?related=elements,project,submissions,submissions__market";
        ajaxWrapper("GET",  url, {}, this.loadForm.bind(this));
    }

    loadForm(result){
        if (this.props.id != result[0]['projectform']['id']) {
            var id = result[0]['projectform']['id'];
            window.location = '/' + this.props.params[0] + '/' + this.props.project + '/' + this.props.params[2] + '/' + id + '/';
        }

        var form = result[0]['projectform'];
        var elements = {};
        for (var i in form['elements']) {
            if (form['elements'][i]['formelement']['data'] == ""){
                form['elements'][i]['formelement']['data'] = {}
            }
            elements[form['elements'][i]['formelement']['id']] = form['elements'][i]['formelement'];
        }

        this.setState({
            form: form,
            elements: elements
        });
    }

    render() {
        var submissions = [];
        var submissionComponents = [];
        var submissionComponentProps = [];
        var submissionCards = [];
        for (var i in this.state.form['submissions']){
            var submission = this.state.form['submissions'][i]['formsubmission'];
            var title = submission['searchTerm'];
            if ('name' in submission['market']){
                title += " : " + submission['market']['name'];
            }
            submissions.push(title);
            submissionComponents.push(SubmissionTable);
            submissionComponentProps.push({
                data: submission,
                elements: this.state.elements
            });

            submissionCards.push(
                <div className='card' style={{textAlign:'left', padding:'10px'}}>
                    <h5>{title}</h5>
                    <Button css={{marginLeft: "10px"}} inline={true} type={'info'}
                        text={'View Result'} href={'/project/' + this.props.project + '/results/' + this.props.id + '/submission/' + submission.id + '/'} />
                </div>
            );
        }
        var submissionTables = <Accordion names={submissions} ComponentList={submissionComponents}
            ComponentProps={submissionComponentProps} open={[true]} />;

        var charts = [];
        for (var key in this.state.elements){
            var element = this.state.elements[key];
            var answers = [];
            var answerCount = [];

            for (var i in this.state.form['submissions']){
                var submission = this.state.form['submissions'][i]['formsubmission'];
                if (key in submission['data']){
                    var answer = submission['data'][key];

                    var index = answers.indexOf(answer);
                    if (index > -1){
                        answerCount[index] += 1;
                    } else {
                        answers.push(answer);
                        answerCount.push(1);
                    }
                }

            }

            if (answers.length){
                var chartData = [];
                for (var i in answers){
                    chartData.push({
                        label: String(answers[i]),
                        value: answerCount[i],
                        color: CHARTCOLORS[(i%CHARTCOLORS.length)]['color'],
                        highlight: CHARTCOLORS[(i%CHARTCOLORS.length)]['highlight']
                    });
                }

                charts.push(
                    <div className='col-3'>
                        <div style={{textAlign: 'left'}}>
                            {element['pretext']}
                        </div>
                        <PieChart data={chartData} options={{}}/>
                        <br/><br/>
                    </div>
                );
            }
        }



        var content =
        <div className='container'>
            <br/><br/>
            <div style={{textAlign:"center"}} className='row'>
                <div className='col-12' style={{textAlign:'left'}}>
                    <h1>Results : {this.state.form.title}</h1>
                </div>

                <div className='col-12 row'>
                </div>

                <div className='col-12 row'>
                    <br/><br/><br/>
                </div>

                <div className='col-12'>
                    {submissionCards}
                </div>

                <br/>
            </div>
        </div>;

        return (
            <Wrapper token={this.props.user_id} loaded={this.state.loaded}  content={content} />
        );
    }
}


class SubmissionTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true
        };
    }

    render() {
        var data = [];
        for (var key in this.props.data['data']){
            if (key in this.props.elements){
                var question = this.props.elements[key].pretext;
                var value = this.props.data['data'][key];
                data.push({
                    id: key,
                    question: question,
                    answer: value
                });
            }
        }

        var columns = [{
            dataField: 'question',
            text: 'Question'
        }, {
            dataField: 'answer',
            text: 'Answer'
        }];

        var content = <BootstrapTable keyField='id' data={data} columns={columns} />;

        return (
            <Wrapper token={this.props.user_id} loaded={this.state.loaded}  content={content} />
        );
    }
}





export default ResultPage;
