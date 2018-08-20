import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import {Container, Button, Image, Form, TextInput, Navbar, List, Table, Accordion, Paragraph, RadioButton, TextArea, Header, Select, ColorPicker, EmojiList, EmojiSlider} from 'library';
import ajaxWrapper from 'base/ajax.js';
import Nav from 'projectLibrary/nav.js';
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
            slides: [],
            slideAverage: 0,
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
      var dates = this.state.dates;
      for (var index in result) {
        var impression = result[index]['sliderimpressions']
        var date = impression['date'].substring(0,10);
        var dateIndex = dates.indexOf(date);
        impressionsByDay[dateIndex] += 1;
      }
      this.setState({impressionsByDay:impressionsByDay})
    }

    answersData(result) {
      var clicksByDay = [0,0,0,0,0,0,0]
      var slidesByDay = [0,0,0,0,0,0,0]
      var slides = []
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
        }
      }
      var slideAverage = Math.floor(slideTotal/slides.length)
      this.setState({slideAverage: slideAverage, slides:slides, slidesByDay:slidesByDay, clicksByDay:clicksByDay, loaded: true})
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
            data: this.state.impressionsByDay,
            fillColor:"rgba(220,220,220,0.2)",
            label:"Impressions By Day",
            pointColor:"rgba(220,220,220,1)",
            pointHighlightFill:"#fff",
            pointHighlightStroke:"rgba(220,220,220,1)",
            pointStrokeColor:"#fff",
            strokeColor:"rgba(220,220,220,1)"
          },
          {
            data: this.state.clicksByDay,
            fillColor:"rgba(151,187,205,0.2)",
            label:"Clicks By Day",
            pointColor:"rgba(151,187,205,1)",
            pointHighlightFill:"#fff",
            pointHighlightStroke:"rgba(151,187,205,1)",
            pointStrokeColor:"#fff",
            strokeColor:"rgba(151,187,205,1)"
          },
          {
            data: this.state.slidesByDay,
            fillColor:"rgba(255,140,0,0.2)",
            label:"Slides By Day",
            pointColor:"rgba(255,69,0,1)",
            pointHighlightFill:"#fff",
            pointHighlightStroke:"rgba(255,69,0,1)",
            pointStrokeColor:"#fff",
            strokeColor:"rgba(255,69,0,1)"
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
              }
      };

      if (this.state.loaded == true) {
        var canvas_width = document.getElementById('body').getBoundingClientRect().width;
      var content = <div>
      <EmojiSlider {...this.state.emojiForm} handleStart={this.sliderStart} handleStop={this.sliderStop} live={false} width={this.state.slideAverage} />
      <Button href={'/sliderEditor/' + this.state.emojiForm.domain + '/' + this.props.slider + '/'} text={"Edit Slider"} type={'primary'} />
      <Header size={4} text={'HTML Code'} />
      <Paragraph text={'<iframe src="http://emoji.jthiesen1.webfactional.com/slider/' + this.props.slider + '/" width="' + this.state.emojiForm.width + '" frameBorder="0" seamless>Browser not compatible.</iframe>'} />

      <Header size={2} text={'Slider Data'} />
      <LineChart data={data} options={options} width={canvas_width} />

      <Table headers={['Date','IP','Value']} data={this.state.slides} />
      </div>
    }
    else {
      var content=<div></div>
    }

        return (
          <div>
          <Nav />
          <div id="body" className="container">

              <Wrapper content={content} loaded={this.state.loaded} />
          </div>
          </div>

        );
    }
}

export default EmojiSliderDetails;
