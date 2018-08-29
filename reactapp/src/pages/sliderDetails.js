import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Table, Accordion, Paragraph, RadioButton, TextArea, Header, Select, ColorPicker, EmojiList, EmojiSlider} from 'library';
import ajaxWrapper from 'base/ajax.js';
import Nav from 'projectLibrary/nav.js';
import Sidebar from 'projectLibrary/sidebar.js';

var LineChart = require("react-chartjs").Line;

class EmojiSliderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            emojiForm: {
              prompt: 'How fast is the emoji slider going to take off?',
              background_color: '#fff',
              progress_bar_color: '#ff0000',
              emoji:'rocket',
              text_color:'#000',
              width: '100%',
              domain: this.props.domain,
            },
            impressionsByDay: [0,0,0,0,0,0,0],
            clicksByDay: [0,0,0,0,0,0,0],
            slidesByDay: [0,0,0,0,0,0,0],
            uniquesByDay: [0,0,0,0,0,0,0],
            slides: [],
            slideAverage: 0,
            totalSlides: 0,
            totalImpressions: 0,
            totalUniques: 0,
            dates: [],
        };
        this.getSliderData = this.getSliderData.bind(this);
        this.getAllData = this.getAllData.bind(this);
        this.impressionsData = this.impressionsData.bind(this);
        this.answersData = this.answersData.bind(this);
    }

    componentDidMount() {
       var dates = []
        for (var x = 0; x < 7; x++) {
            var d = new Date();
            d.setDate(d.getDate() - (6-x));
            var month = d.getUTCMonth() + 1; //months from 1-12
            var day = d.getUTCDate();
            var year = d.getUTCFullYear();
            if (month < 10) {
              month = "0" + month;
            }
            if (day < 10) {
              day = "0" + day;
            }
            var newdate = year + "-" + month + "-" + day;
            dates.push(newdate)
        }

        this.setState({dates:dates}, () => this.getAllData(dates[0]))
    }

    getAllData(newdate) {
      ajaxWrapper('GET','/api/home/emojislider/' + this.props.slider + '/', {}, this.getSliderData)
      ajaxWrapper('GET','/api/home/sliderimpressions/?emoji_slider=' + this.props.slider + '&date__gte=' + newdate, {}, this.impressionsData)
      ajaxWrapper('GET','/api/home/slideranswers/?emoji_slider=' + this.props.slider + '&date__gte=' + newdate, {}, this.answersData)
    }

    impressionsData(result) {
      var impressionsByDay = [0,0,0,0,0,0,0]
      var uniquesByDay = [0,0,0,0,0,0,0]
      var ipList = []
      var totalImpressions = 0;
      var totalUniques = 0;
      var dates = this.state.dates;
      for (var index in result) {
        var impression = result[index]['sliderimpressions']
        var date = impression['date'].substring(0,10);
        var dateIndex = dates.indexOf(date);
        impressionsByDay[dateIndex] += 1;
        totalImpressions += 1;
        if (ipList.indexOf(impression.ip) == -1) {
          ipList.push(impression.ip);
          uniquesByDay[dateIndex] += 1;
          totalUniques += 1;
        }
      }
      this.setState({impressionsByDay:impressionsByDay, uniquesByDay:uniquesByDay, totalImpressions:totalImpressions, totalUniques:totalUniques})
    }

    answersData(result) {
      var clicksByDay = [0,0,0,0,0,0,0]
      var slidesByDay = [0,0,0,0,0,0,0]
      var slides = []
      var totalSlides = 0;
      var slideTotal = 0;
      var dates = this.state.dates;
      for (var index in result) {
        var answer = result[index]['slideranswers']
        var date = answer['date'].substring(0,10);
        var dateIndex = dates.indexOf(date);
        if (answer['value'] == -1) {
          clicksByDay[dateIndex] += 1;
        }
        else {
          slidesByDay[dateIndex] += 1;
          slides.push([date,answer['ip'],answer['value']]);
          slideTotal += answer['value']
          totalSlides += 1
        }
      }
      var slideAverage = Math.floor(slideTotal/slides.length)
      this.setState({slideAverage: slideAverage, slides:slides,totalSlides:totalSlides, slidesByDay:slidesByDay, clicksByDay:clicksByDay, loaded:true})
    }

    getSliderData(result) {
      var slider = result[0]['emojislider'];
      var emojiForm = this.state.emojiForm;
      for (var index in slider) {
        emojiForm[index] = slider[index]
      }
      this.setState({emojiForm: emojiForm})
    }

    render() {

      var data = {
        labels: this.state.dates,
        datasets: [{
            fillColor:"rgba(255,255,255,0)",

            data: this.state.impressionsByDay,
            label:"Impressions By Day",
            pointColor:"#ff6384",
            pointHighlightFill:"#fff",
            pointHighlightStroke:"#ff6384",
            pointStrokeColor:"#fff",
            strokeColor:"#ff6384",
          },
          {
              fillColor:"rgba(255,255,255,0)",
              data: this.state.uniquesByDay,
              label:"Uniques By Day",
              pointColor:"#36a2eb",
              pointHighlightFill:"#fff",
              pointHighlightStroke:"#36a2eb",
              pointStrokeColor:"#fff",
              strokeColor:"#36a2eb",
            },
          {
            fillColor:"rgba(255,255,255,0)",
            data: this.state.clicksByDay,
            label:"Clicks By Day",
            pointColor:"#33cab9",
            pointHighlightFill:"#fff",
            pointHighlightStroke:"#33cab9",
            pointStrokeColor:"#fff",
            strokeColor:"#33cab9",
          },
          {
            fillColor:"rgba(255,255,255,0)",
            data: this.state.slidesByDay,
            label:"Slides By Day",
            pointColor:"#9966ff",
            pointHighlightFill:"#fff",
            pointHighlightStroke:"#9966ff",
            pointStrokeColor:"#fff",
            strokeColor:"#9966ff",
          }


        ]
      };

      // Notice the scaleLabel at the same level as Ticks
      var options = {
        scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      },
                      scaleLabel: {
                           display: true,
                           labelString: 'Moola',
                           fontSize: 40
                        }
                  }]
              },
              elements: {line:{fill:false}}
      };

      if (this.state.loaded == true) {
        var canvas_width = document.getElementById('body').getBoundingClientRect().width;
      var content = <div>
      <EmojiSlider {...this.state.emojiForm} handleStart={this.sliderStart} handleStop={this.sliderStop} live={false} width={this.state.slideAverage} />
      <div style={{'textAlign':'center'}}>
      <Button href={'/sliderEditor/' + this.state.emojiForm.domain_id + '/' + this.props.slider + '/'} text={"Edit Slider"} type={'primary'} />
      </div>
      <Header size={4} text={'HTML Code'} />
      <Paragraph text={'<iframe src="https://slidemoji.com/slider/' + this.props.slider + '/" width="' + this.state.emojiForm.width + '" frameBorder="0" height="300px" scrolling="no" seamless>Browser not compatible.</iframe>'} />

      <div className="card">
            <div className="card-header">
                <h5 className="card-title">Slider Data</h5>
              </div>
      <Table headers={['Date','IP','Value']} data={this.state.slides} />
      </div>
      </div>
    }
    else {
      var content=<div></div>
    }

    if (this.props.user_id) {
      var sidebar = <Sidebar domain={this.props.domain} user={this.props.user_id} />;
    }
    else {
      var sidebar = <div></div>
    }
    if (this.state.loaded == true) {
      var lineChart = <LineChart data={data} options={options} width={canvas_width*.9} height={canvas_width*.9/3} />
    }
    else {
      var lineChart = <div></div>
    }

      return (
        <div style={{'backgroundColor':'#f5f6fa'}}>
        <Nav />
        {sidebar}
        <div className="container" style={{'marginTop':'50px'}}>
        <div className="main-content">
          <div className="row">





            <div className="col-md-4">
              <div className="card card-body">
                <div className="flexbox">
                    <span className="fw-400">Total Uniques</span><br />
                    <span>
                      <span className="fs-18 ml-1">{this.state.totalUniques}</span>
                    </span>
                  </div>
                </div>
              </div>



              <div className="col-md-4">
                <div className="card card-body">
                  <div className="flexbox">
                      <span className="fw-400">Total Slides</span><br />
                      <span>
                        <span className="fs-18 ml-1">{this.state.totalSlides}</span>
                      </span>
                    </div>
                  </div>
                </div>



                <div className="col-md-4">
                  <div className="card card-body">
                    <div className="flexbox">
                        <span className="fw-400">Total Impressions</span><br />
                        <span>
                          <span className="fs-18 ml-1">{this.state.totalImpressions}</span>
                        </span>
                      </div>
                    </div>
                  </div>








            <div className="col-md-12" id="body">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title"><strong>Engagement</strong></h5>
                </div>

                <div className="card-body">
                  <ul className="list-inline text-center gap-items-4 mb-30">
                    <li className="list-inline-item">
                      <i className="fas fa-circle" style={{"color": "#33cab9"}}></i>
                      <span>Clicks</span>
                    </li>
                    <li className="list-inline-item">
                      <i className="fas fa-circle" style={{"color": "#9966ff"}}></i>
                      <span>Slides</span>
                    </li>
                    <li className="list-inline-item">
                      <i className="fas fa-circle" style={{"color": "#36a2eb"}}></i>
                      <span>Uniques</span>
                    </li>
                    <li className="list-inline-item">
                      <i className="fas fa-circle" style={{"color": "#ff6384"}}></i>
                      <span>Impressions</span>
                    </li>
                  </ul>

                  {lineChart}
                </div>
              </div>
            </div>
            </div>
            </div>
            <Wrapper content={content} loaded={this.state.loaded} />

        </div>
        </div>
           );
    }
}

export default EmojiSliderDetails;
