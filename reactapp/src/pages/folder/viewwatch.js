import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables, sort_objects, format_date_string, format_date, format_number} from 'functions';

import {Wrapper, Instance, Paragraph, TableWithChildren, ListWithChildren, Button, FormWithChildren, DateTimePicker, Select, Icon} from 'library';

import {Line} from 'react-chartjs-2'
import CanvasJSReact from '../js/canvasjs.react.js';


import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";


var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function getDates(start_date, end_date) {
  if (start_date == end_date) {
    return [start_date]
  }
  else {
    var starting_date = new Date();
    var start_date_split = start_date.split('-')
    starting_date.setYear(parseInt(start_date_split[0]))
    starting_date.setMonth(parseInt(start_date_split[1])-1)
    starting_date.setDate(parseInt(start_date_split[2]))

    var ending_date = new Date();
    var end_date_split = end_date.split('-')
    ending_date.setYear(parseInt(end_date_split[0]))
    ending_date.setMonth(parseInt(end_date_split[1])-1)
    ending_date.setDate(parseInt(end_date_split[2]))

    if (starting_date > ending_date) {
      return [];
    }
    else {
      var dayList = [];
      while (starting_date <= ending_date) {
        var month = '' + (starting_date.getMonth() + 1);
        var day = '' + starting_date.getDate();
        var year = starting_date.getFullYear();

        if (month.length < 2) {month = '0' + month;}
        if (day.length < 2) {day = '0' + day;}
        var date_string = [year,month,day].join('-')
        dayList.push(date_string)
        starting_date.setDate(starting_date.getDate() + 1)

      }
      return dayList;
    }

  }


}


// Arithmetic mean
let getMean = function (data) {
    return data.reduce(function (a, b) {
        return Number(a) + Number(b);
    }) / data.length;
};


// Standard deviation
let getSD = function (data) {
    let m = getMean(data);
    return Math.sqrt(data.reduce(function (sq, n) {
            return sq + Math.pow(n - m, 2);
        }, 0) / (data.length - 1));
};

class ViewWatch extends Component {
    constructor(props) {
        super(props);


        var start_date = new Date(Date.now() - 24192e5);


        var end_date = new Date();

        start_date = format_date(start_date, 'yyyy-mm-dd')
        end_date = format_date(end_date, 'yyyy-mm-dd')
        var favorite = false;



        this.state ={watch_instances:[], watch_data: {'brand':'', model:'', reference_number:''}, start_date: start_date, end_date: end_date, condition:'', papers:'', box:'', manual:'', source:'', filters:false, wholesale:'', favorite: favorite}
        this.priceCallback = this.priceCallback.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);
        this.watchCallback = this.watchCallback.bind(this);
        this.favorite = this.favorite.bind(this);
        this.unfavorite = this.unfavorite.bind(this);
    }

    componentDidMount() {
        ajaxWrapper('GET','/api/home/watch_instance/?related=source,historical_prices&order_by=created_at&watch=' + this.props.watch_id, {}, this.priceCallback)
        ajaxWrapper('GET','/api/home/watch/' + this.props.watch_id + '/', {}, this.watchCallback)
    }

    priceCallback(result) {
        var historicprices = [];

        for (var index in result) {
            historicprices.push(result[index]['watch_instance'])
        }

        this.setState({'watch_instances':historicprices, loaded:true})
    }

    watchCallback(result) {
        this.setState({watch_data: result[0]['watch']})
    }

    setGlobalState(name, state) {
        this.setState(state);
    }

    favorite() {
        ajaxWrapper('POST','/api/home/watch/' + this.props.watch_id + '/', {'user_favorites[]': [window.cmState.user.id]}, () => this.setState({favorite: true}))
        this.props.refreshData();
    }

    unfavorite() {
        ajaxWrapper('POST','/api/home/watch/' + this.props.watch_id + '/', {'user_favorites__remove[]':[window.cmState.user.id]}, () => this.setState({favorite: false}))
        this.props.refreshData();
    }

    render() {
        console.log("This.props.favorites", this.props.favorites)

        var dayList = getDates(this.state.start_date, this.state.end_date)

        var datasets = [];
        var min_price = 100000000;
        var max_price = 0;

        var watch_instance_rows = [];
        var colors = [
            '#7460ee',
            '#009efb',
            '#f62d51',
            '#ddd',
        ]
        var wholesale_data = [];
        var retail_data = [];

        var sources = [];
        var filter_list = ['source','condition','papers','box','wholesale']

        for (var instance_index in this.state.watch_instances) {
            var instance = this.state.watch_instances[instance_index];

            if (sources.indexOf(instance.source.name) == -1) {
                sources.push(instance.source.name)
            }

            var filtered = false;
            for (var filter_index in filter_list) {
                var filter = filter_list[filter_index];
                var value = this.state[filter];


                if (value == '') {
                    continue;
                }
                else {
                    if (value == "false") {
                        value = false;
                    }
                    if (value == "true") {
                        value = true;
                    }

                    if (filter == 'source') {
                        if (instance[filter]['name'] != value) {
                            filtered = true;
                        }
                    }
                    else if (instance[filter] != value) {
                        filtered = true;
                    }
                }

            }
            if (filtered) {
                continue;
            }


            var sold_date = "Not Sold";
            if (instance.sold_time) {
                sold_date = format_date_string(instance.sold_time, 'mm/dd/yyyy HH:MM')
            }


            var papers = 'No';
            if (instance.papers) {
                papers = 'Yes';
            }

            var manual = 'No';
            if (instance.manual) {
                manual = 'Yes';
            }

            var box = 'No';
            if (instance.box) {
                box = 'Yes';
            }

            var url = instance.url;
            if (instance.source.name == 'We Love Watches') {
                url = 'https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQhzAp8r-Po0KalE6Te3kpZ0ZKByk4LT_cA6PfgESjh6YN5gzW4RpjwrFEhWwZwxBy5CnAJuNZdUCN6/pubhtml?gid=735652720&single=true';
            }


            watch_instance_rows.push(<tr>
                    <td>{instance.source.name}</td>
                    <td>${format_number(instance.price,2)}</td>
                    <td>{instance.condition}</td>
                    <td>{box}</td>
                    <td>{papers}</td>
                    <td>{instance.info}</td>
                    <td>{sold_date}</td>
                    <td><Button href={url} type={'success'} text={'View'} target={'_blank'} /></td>
                </tr>);

            var label = instance.source.name + ' #' + instance_index;
            var data = [];


            var price_list = [];
            for (var price_index in instance.historical_prices) {
                price_list.unshift(instance.historical_prices[price_index]['historicprice'])
            }

            for (var index in price_list) {
                var historicprice = price_list[index];
                if (historicprice.price < min_price) {
                    min_price = historicprice.price;
                }
                if (historicprice.price > max_price) {
                    max_price = historicprice.price;
                }
                var price_change_date = historicprice.created_at.split('T')[0];
                var sold_time = null;
                if (instance.sold_time) {
                    sold_time = instance.sold_time.split('T')[0]
                }
                for (var day_index in dayList) {

                    if (!instance.sold_time && index == price_list.length - 1 && Date.parse(price_change_date) <= Date.parse(dayList[day_index])) {
                        data.push(historicprice.price);
                    }
                    else if (instance.sold_time && Date.parse(instance.sold_time) <= Date.parse(dayList[day_index])) {
                        data.push(null);
                    }
                    else if (data.length <= day_index && Date.parse(price_change_date) <= Date.parse(dayList[day_index])) {
                        data.push(historicprice.price);
                    }
                    else if (data.length <= day_index) {
                        data.push(null);
                    }
                }
            }

            if (instance.wholesale) {
                wholesale_data.push(data);
            }
            else {
                retail_data.push(data);
            }

        }


        var wholesale_data_points = []
        var wholesale_candlestick = [];

        for (var temp_index in wholesale_data[0]) {
            var datum = 0;
            var count = 0;
            var temp_data = [];
            for (var data_index in wholesale_data) {
                if (wholesale_data[data_index][temp_index]) {
                     datum += wholesale_data[data_index][temp_index]
                     temp_data.push(datum);
                     count += 1;
                 }
            }
            console.log("temp_data", temp_data)

            if (datum == 0) {
                wholesale_data_points.push(null);
                wholesale_candlestick.push([])
            }
            else {
                var price = Math.round(datum/count)
                wholesale_data_points.push(price)
                temp_data = wholesale_data_points.sort(function(a,b) {
                  return (+a) - (+b);
                });

                var mean = getMean(wholesale_data_points);
                var sd = getSD(wholesale_data_points);
                console.log("Mean", mean, sd, mean-sd, mean+sd)
                if (temp_data.length > 1) {
                    wholesale_candlestick.push([mean - sd, temp_data[temp_data.length - 1], temp_data[0], mean + sd])
                }
                else {
                    wholesale_candlestick.push([temp_data[0], temp_data[0], temp_data[0], temp_data[0]])
                }

                console.log("wholesale candlestick", wholesale_candlestick)
            }
        }

        var wholesale_current_average = wholesale_data_points[wholesale_data_points.length - 1];
        var wholesale_pct_diff = 0;

        var wholesale_starting_average = wholesale_data_points[wholesale_data_points.length -1];
        for (var average_index in wholesale_data_points) {
            if (wholesale_data_points[average_index]) {
                wholesale_starting_average = wholesale_data_points[average_index];
                break;
            }
        }

        if (wholesale_starting_average > wholesale_current_average) {
            var wholesale_trend = <Icon icon={'sort-down'} style={{color:'red'}} size={1} />;
            wholesale_pct_diff = (wholesale_current_average/wholesale_starting_average) * 100 - 100
        }
        else if (wholesale_starting_average == wholesale_current_average) {
            var wholesale_trend = null;
        }
        else {
            wholesale_trend = <Icon icon={'sort-up'} style={{color:'green'}} size={1} />;
            wholesale_pct_diff = -1 * (100 - (wholesale_current_average/wholesale_starting_average) * 100)
        }

        console.log("Wholesale Candlestick", wholesale_candlestick)
        var retail_candlestick = [];
        var retail_data_points = [];

        for (var temp_index in retail_data[0]) {
            var datum = 0;
            var count = 0;
            var temp_data = [];
            for (var data_index in retail_data) {
                if (retail_data[data_index][temp_index]) {
                     datum += retail_data[data_index][temp_index]
                     temp_data.push(datum)
                     count += 1;
                 }
            }

            if (datum == 0) {
                retail_data_points.push(null);
                retail_candlestick.push([])
            }
            else {
                var price = Math.round(datum/count)
                retail_data_points.push(price)
                console.log("retail Data points", retail_data_points, temp_data)
                temp_data = retail_data_points.sort(function(a,b) {
                  return (+a) - (+b);
                });

                var mean = getMean(retail_data_points);
                var sd = getSD(retail_data_points);
                console.log("Mean", mean, sd, mean-sd, mean+sd)

                if (temp_data.length > 1) {
                    retail_candlestick.push([mean-sd, temp_data[temp_data.length - 1], temp_data[0], mean+sd])
                }
                else {
                    retail_candlestick.push([temp_data[0], temp_data[0], temp_data[0], temp_data[0]])
                }
            }
        }

        var retail_current_average = retail_data_points[retail_data_points.length - 1];
        var retail_pct_diff = 0;

        var retail_starting_average = retail_data_points[retail_data_points.length -1];
        for (var average_index in retail_data_points) {
            if (retail_data_points[average_index]) {
                retail_starting_average = retail_data_points[average_index];
                break;
            }
        }


        if (retail_starting_average > retail_current_average) {
            var retail_trend = <Icon icon={'sort-down'} style={{color:'red'}} size={1} />;
            retail_pct_diff = (retail_current_average/retail_starting_average) * 100 - 100
        }
        else if (retail_starting_average == retail_current_average) {
            var retail_trend = null;
        }
        else {
            retail_trend = <Icon icon={'sort-up'} style={{color:'green'}} size={1} />;
            retail_pct_diff = -1 * (100 - (retail_current_average/retail_starting_average) * 100)
        }



        if (this.state.loaded) {
            var retail_candle_data = [];
            var wholesale_candle_data = [];
            console.log("retail_candlestick", retail_candlestick, wholesale_candlestick)
            for (var index in dayList) {
                console.log("daylist index", index, wholesale_candlestick[index])
                retail_candle_data.push({x: new Date(format_date_string(dayList[index], 'yyyy-mm-dd')), y: retail_candlestick[index]})
                wholesale_candle_data.push({x: new Date(format_date_string(dayList[index], 'yyyy-mm-dd')), y: wholesale_candlestick[index]})
            }

            console.log("retail_candle_data", retail_candle_data, wholesale_candle_data)

            var options_retail = {
    			theme: "dark2", // "light1", "light2", "dark1", "dark2"
    			animationEnabled: true,
    			exportEnabled: true,
    			axisX: {
    				title: "Date",

    			},
    			axisY: {
    				includeZero:false,
    				prefix: "$",
    				title: "Price (in USD)"
    			},
    			data: [{
    				type: "candlestick",
    				showInLegend: true,
    				name: "Retail",
                    yValueFormatString: "$###0.00",
    				xValueFormatString: "MMMM YY",
    				dataPoints: retail_candle_data
    			},
    		  ]
    		}

            var options_wholesale = {
    			theme: "dark2", // "light1", "light2", "dark1", "dark2"
    			animationEnabled: true,
    			exportEnabled: true,
    			axisX: {
    				title: "Date",

    			},
    			axisY: {
    				includeZero:false,
    				prefix: "$",
    				title: "Price (in USD)"
    			},
    			data: [
                {
    				type: "candlestick",
    				showInLegend: true,
    				name: "Wholesale",
                    yValueFormatString: "$###0.00",
    				xValueFormatString: "MMMM YY",
    				dataPoints: wholesale_candle_data
    			}
    		  ]
    		}

            var options_all = {
        			theme: "dark2", // "light1", "light2", "dark1", "dark2"
        			animationEnabled: true,
        			exportEnabled: true,
        			axisX: {
        				title: "Date",

        			},
        			axisY: {
        				includeZero:false,
        				prefix: "$",
        				title: "Price (in USD)"
        			},
        			data: [
                    {
        				type: "candlestick",
        				showInLegend: true,
        				name: "Wholesale",
                        yValueFormatString: "$###0.00",
        				xValueFormatString: "MMMM YY",
        				dataPoints: wholesale_candle_data
        			},
                    {
        				type: "candlestick",
        				showInLegend: true,
        				name: "Retail",
                        yValueFormatString: "$###0.00",
        				xValueFormatString: "MMMM YY",
        				dataPoints: retail_candle_data
        			},
        		  ]
        		}



        }




        datasets = [
            {data:wholesale_data_points, label:'Average Wholesale Prices',fill:false, borderColor: colors[0], fontColor:'white'},
            {data:retail_data_points, label:'Average Retail Prices',fill:false, borderColor: colors[1], fontColor:'white'},
        ]

        var format_day_list = [];
        for (var index in dayList) {
            format_day_list.push(format_date_string(dayList[index], 'mm-dd-yyyy'))
        }

        console.log("datasets", datasets)
        var chart_data = {
            labels: format_day_list,
            datasets: datasets,
      }

  var chart_options = {
      responsive: true,
    title: {
      display: true,
      text: 'Watch Prices Over Time',
      fontColor:'white',
    },
    legend: {
     labels: {
          fontColor: 'white'
         }
      },
    tooltips: {
      mode: 'label'
    },
    hover: {
      mode: 'dataset'
    },
    scales: {
      xAxes: [
        {
          display: true,
          fontColor:'white',
          scaleLabel: {

            show: true,
            labelString: 'Date'
        },
          ticks: {
              fontColor:'white',
          }
        }
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {

            show: true,
            labelString: 'Price'
          },
          ticks: {
            fontColor:'white',
            suggestedMin: min_price*.9,
            suggestedMax: max_price*1.1,
          }
        }
      ]
    }
  };

    var source_options = [{text:'All', value:''}];
    for (var index in sources) {
        source_options.push({'text':sources[index], value: sources[index]})
    }

    var width = 1000;
    var height = 400;

    if (isMobile) {
        width = 1000;
        height = 1000;

    }

    var filters = <FormWithChildren setGlobalState={this.setGlobalState} row={true} autoSetGlobalState={true} objectName={'filters'} defaults={this.state} style={{marginTop:'20px'}}>
        <DateTimePicker label='Start Date' name='start_date' className="col-md-2 col-xs-6" display_time={false} />
        <DateTimePicker label='End Date' name='end_date' className="col-md-2 col-xs-6" display_time={false} />
        <Select label='Source' name='source' options={source_options} className="col-md-2" />
        <Select label='Condition' name='condition' options={[{'text':'All', value:''},{'text':'New', value:'New'},{'text':'Pre-Owned',value:'Pre-Owned'}]} className="col-md-2" />
        <Select label='Paper/Card' name='papers' options={[{'text':'All', value:''},{'text':'Yes', value:true},{'text':'No',value:false}]} className="col-md-1" />
        <Select label='Box' name='box' options={[{'text':'All', value:''},{'text':'Yes', value:true},{'text':'No',value:false}]} className="col-md-1" />
        <Select label='Market' name='wholesale' options={[{'text':'All', value:''},{'text':'Wholesale', value:true},{'text':'Retail',value:false}]} className="col-md-1" />
    </FormWithChildren>;

    if (isMobile && !this.state.filters) {
        filters = null;
    }

    var col_size = 'col-3'
    if (isMobile) {
        var col_size  = 'col-6'
    }

    var average_wholesale = null
    if (wholesale_current_average) {
        average_wholesale = <div className={col_size}>
            <p style={{color:'#ddd'}}>{this.state.watch_data.brand} {this.state.watch_data.reference_number} Average Wholesale Price</p>
            <div>
                <h3 style={{color:'#ddd'}}>${format_number(wholesale_current_average, 2)} {wholesale_trend} ({wholesale_pct_diff.toFixed(2)}%)</h3>
            </div>
        </div>;;
    }

    var average_retail = null;
    if (retail_current_average) {
        average_retail = <div className={col_size}>
            <p style={{color:'#ddd'}}>{this.state.watch_data.brand} {this.state.watch_data.reference_number} Average Retail Price</p>
            <div>
                <h3 style={{color:'#ddd'}}>${format_number(retail_current_average,2)} {retail_trend} ({retail_pct_diff.toFixed(2)}%)</h3>
            </div>
        </div>;
    }

    var favorite = <div onClick={this.favorite} style={{color:'white'}} >
        <Icon icon='star' size={1} /> Favorite
    </div>;
    console.log("Favorites", this.props.favorites, this.props.watch_id)
    var favorites_list = [];
    for (var index in this.props.favorites) {
        favorites_list.push(this.props.favorites[index]['id'])
    }

    if (favorites_list.indexOf(this.props.watch_id) > -1) {
        var favorite = <div onClick={this.unfavorite} style={{color:'yellow'}}>
            <Icon icon='star' size={1}  /> Favorited
        </div>;
    }

    var chart = null;
    if (this.state.loaded) {
        chart = [<CanvasJSReact.CanvasJSChart options = {options_retail}
            onRef={ref => this.chart = ref}
        />,
        <CanvasJSReact.CanvasJSChart options = {options_wholesale}
            onRef={ref => this.chart = ref}
        />,
        <CanvasJSReact.CanvasJSChart options = {options_all}
            onRef={ref => this.chart = ref}
        />];
    }

    var content = <div className="container">
        <MobileView>
            <Button onClick={() => this.props.choose_watch(null)} text={'Go Back'} type='danger' />
            <div style={{'height':'30px'}}></div>
        </MobileView>
            <div className="row">
                {average_wholesale}
                {average_retail}
            </div>
            {favorite}
            {chart}
            <div style={{height:'20px'}}></div>

    			<Paragraph text={"Brand: " + this.state.watch_data.brand} style={{display:"inline", marginRight:'20px', color:'white'}} required={""} parent={"0"} className="text-white"/>
    			<Paragraph text={"Model: " + this.state.watch_data.model} style={{display:"inline", marginRight:'20px', color:'white'}} required={""} parent={"0"}  className="text-white"/>
    			<Paragraph text={"Reference Number: " + this.state.watch_data.reference_number} style={{display:"inline", marginRight:'20px', color:'white'}} required={""} parent={"0"}  className="text-white"/>
                <Button text={'Edit Watch Details'} type={'primary'} href={'/editWatch/' + this.state.watch_data.id} />

            <div style={{height:'30px'}}></div>
            <MobileView>
                <Button onClick={() => this.setState({filters: !this.state.filters})} text={'Toggle Filters'} type='info' />
            </MobileView>
            {filters}

		    <TableWithChildren required={""} headers={['Source', 'Price', 'Condition','Box','Papers','Info','Sold Date','Url']} >
                {watch_instance_rows}
            </TableWithChildren>

        </div>;

        return (<Wrapper content={content} loaded={this.state.loaded} />)

    }

}
export default ViewWatch;
