import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables, sort_objects, format_date_string, format_date} from 'functions';

import {Wrapper, Instance, Paragraph, TableWithChildren, ListWithChildren, Button} from 'library';

import {Line} from 'react-chartjs-2'

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

class ViewWatch extends Component {
    constructor(props) {
        super(props);
        this.state ={watch_instances:[]}
        this.priceCallback = this.priceCallback.bind(this);
    }

    componentDidMount() {
        ajaxWrapper('GET','/api/home/watch_instance/?related=source,historical_prices&order_by=created_at&watch=' + window.cmState.params[1], {}, this.priceCallback)
    }

    priceCallback(result) {
        var historicprices = [];

        for (var index in result) {
            historicprices.push(result[index]['watch_instance'])
        }

        this.setState({'watch_instances':historicprices, loaded:true})
    }

    render() {

        var start_date = new Date(Date.now() - 12096e5);
        var end_date = new Date();
        var dayList = getDates(format_date(start_date, 'yyyy-mm-dd'), format_date(end_date, 'yyyy-mm-dd'))

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

        for (var instance_index in this.state.watch_instances) {
            var instance = this.state.watch_instances[instance_index];
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
                    <td>{instance.source.name} #{instance_index}</td>
                    <td>{instance.price}</td>
                    <td>{instance.condition}</td>
                    <td>{papers}</td>
                    <td>{manual}</td>
                    <td>{box}</td>
                    <td>{sold_date}</td>
                    <td><Button href={url} type={'success'} text={'View'} /></td>
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
                var price_change_date = historicprice.created_at;
                for (var day_index in dayList) {
                    if (data.length <= day_index && Date.parse(price_change_date) < Date.parse(dayList[day_index])) {
                        data.push(historicprice.price);
                    }
                    else if (data.length < day_index) {
                        data.push(null);
                    }
                }
            }
            datasets.push({data:data, label:label,fill:false, borderColor: colors[instance_index % 4], fontColor:'white'});
        }

        console.log("datasets", datasets)
        var chart_data = {
            labels: dayList,
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

    var content = <div className="container">
            <Line data={chart_data} options={chart_options} width={1000} height={500} />
            <div style={{height:'20px'}}></div>
            <Instance dataUrl={resolveVariables({"text":"/api/home/watch/{params.1}/"}, window.cmState.getGlobalState(this))["text"]} objectName={"watch"} style={{}} required={""} >
    			<Paragraph text={"Brand: {props.brand}"} style={{display:"inline", marginRight:'20px', color:'white'}} required={""} parent={"0"} className="text-white"/>
    			<Paragraph text={"Model: {props.model}"} style={{display:"inline", marginRight:'20px', color:'white'}} required={""} parent={"0"}  className="text-white"/>
    			<Paragraph text={"Reference Number: {props.reference_number}"} style={{display:"inline", marginRight:'20px', color:'white'}} required={""} parent={"0"}  className="text-white"/>
                <Button text={'Edit Watch Details'} type={'primary'} href={'/editWatch/{props.id}/'} />
            </Instance>
		    <TableWithChildren required={""} headers={['Source', 'Price', 'Condition','Papers','Manual','Box','Sold Date','Url']} >
                {watch_instance_rows}
            </TableWithChildren>
        </div>;

        return (<Wrapper content={content} loaded={this.state.loaded} />)

    }

}
export default ViewWatch;
