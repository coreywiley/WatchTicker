import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from "base/ajax.js";

import {
    Accordion, Button, Table, MapEmbed
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
            form: null,
            elements: {},
            loaded: false,
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
            elements: elements,
            loaded: true
        });
    }

    render() {
        var content = null;
        var submissions = [];
        var places = [];
        var title = null;
        var charts = [];
        var data = [0,0, 0,0,0, 0,0,0];
        var submissionTable = null;
        var map = null;

        if (this.state.form){
            var title = this.state.form.title;
            var elements = this.state.form['elements'];

            for (var i in this.state.form['submissions']){
                var submission = this.state.form['submissions'][i]['formsubmission'];
                var title = submission['searchTerm'];
                if ('name' in submission['market']){
                    title += " : " + submission['market']['name'];
                }

                var viewButton = <Button css={{marginLeft: "10px", 'display': 'inline-block'}} inline={true} type={'info'}
                        text={'View'} href={'/project/' + this.props.project + '/results/' + this.props.id + '/submission/' + submission.id + '/'} />;
                var viewAddress = <div>
                    {submission['data']['address'] + ' '}
                    {viewButton}
                </div>

                submissions.push([
                    i,
                    submission['market']['name'],
                    viewAddress,
                    submission['data'][elements[11]['formelement']['id']],
                    submission['data'][elements[7]['formelement']['id']],
                    '$' + submission['data'][elements[18]['formelement']['id']] + ' - $'  + submission['data'][elements[19]['formelement']['id']],
                    submission['data'][elements[17]['formelement']['id']],
                    '$' + submission['data'][elements[20]['formelement']['id']] + ' - $'  + submission['data'][elements[21]['formelement']['id']],
                ]);

                places.push(submission['data']['placeId']);
            }

            var headers = [
                '#',
                'Buisiness Unit',
                'Property Address',
                'Size',
                'Owned vs. Leased',
                'NNN Market Rent/SF/YR',
                'Sale Value - Vacant',
                'Sale Value - Leaseback'
            ];

            if (this.state.loaded){
                map = <MapEmbed centerAroundCurrentLocation={true} placeIds={places}
                        zoom={4} />;
                submissionTable = <Table headers={headers} data={submissions} />;
            }


            for (var i in this.state.form['submissions']){
                var submission = this.state.form['submissions'][i]['formsubmission'];

                data[2] += parseFloat(submission['data'][elements[11]['formelement']['id']]);
                data[3] += parseFloat(submission['data'][elements[11]['formelement']['id']]);
                data[4] += parseFloat(submission['data'][elements[27]['formelement']['id']]);
                data[5] += parseFloat(submission['data'][elements[17]['formelement']['id']]);
                data[6] += parseFloat(submission['data'][elements[17]['formelement']['id']]);
            }

            data[3] = data[3] / this.state.form['submissions'].length;
            data[4] = data[4] / this.state.form['submissions'].length;
            data[6] = data[6] / this.state.form['submissions'].length;
            for (var i in data){
                data[i] = String(data[i]);
            }

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

            content =
            <div className='container resultPage'>
                <br/><br/>
                <div style={{textAlign:"center"}} className='row'>
                    <div className='col-12' style={{textAlign:'left'}}>
                        <h1>Results : {title}</h1>
                        <br/>
                    </div>

                    <div className='col-12 row'>
                        <div className='col-6'>
                            <div className='rollupCard light tall'>
                                <h1>{data[0]}%</h1>
                                <div>YOY Vacant Sale Portfolio Value<br/>Increase Since 2016</div>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className='rollupCard tall'>
                                <h1>{data[1]}%</h1>
                                <div>YOY 10-Year Leaseback Portfolio Sale Value<br/>Increase Since 2016</div>
                            </div>
                        </div>

                        <div className='col-12'><br/></div>
                    </div>

                    <div className='col-12 row'>
                        <div className='col-4'>
                            <div className='rollupCard light'>
                                <h2>{data[2]}</h2>
                                <div>Total Portfolio SF</div>
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='rollupCard'>
                                <h2>{data[3]}</h2>
                                <div>Avg. Building SF</div>
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='rollupCard dark'>
                                <h2>{data[4]}%</h2>
                                <div>Avg. Portfolio Market Vacancy Rate</div>
                            </div>
                        </div>

                        <div className='col-4'>
                            <div className='rollupCard light'>
                                <h2>${data[5]}</h2>
                                <div>Portfolio Value Estimate</div>
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='rollupCard'>
                                <h2>${data[6]}</h2>
                                <div>Avg. Building Value</div>
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='rollupCard dark'>
                                <h2>${data[7]}</h2>
                                <div>Avg. Portfolio Market Asking<br/> Rate / Year (NNN)</div>
                            </div>
                        </div>

                        <div className='col-12'><br/></div>
                    </div>

                    <div className='col-12 row'>
                        <br/><br/>
                    </div>

                    <div className='col-12'>
                        {submissionTable}
                    </div>

                    <div className='col-12 row'>
                        <br/><br/>
                    </div>

                    <div className='col-12' style={{minHeight:'300px'}}>
                        {map}
                    </div>

                    <br/>
                </div>
            </div>;

        }

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
