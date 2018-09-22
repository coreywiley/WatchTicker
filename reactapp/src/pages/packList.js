import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from 'base/ajax.js';
import {Container, Button, Image, Form, TextInput, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header, Table, Checkbox} from 'library';
import Navbar from 'projectLibrary/nav.js';

class Customers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            orders: [],
            eventInfo: {'name':''}
        };

        this.eventCallback = this.eventCallback.bind(this);
        this.eventInfoCallback = this.eventInfoCallback.bind(this);
    }

    componentDidMount() {
      ajaxWrapper('GET','/api/home/event/' + this.props.event_id + '/?related=customer', {}, this.eventInfoCallback)
      ajaxWrapper('GET','/api/home/order/?related=food_item,food_item__pack_list&event=' + this.props.event_id, {}, this.eventCallback)
    }

    eventInfoCallback(result) {
      this.setState({eventInfo: result[0]['event'], loaded:true})
    }

    eventCallback(result) {

      var orders = [];
      for (var index in result) {
        var shoppinglist = result[index]['order']['food_item']['pack_list']
        orders.push([result[index]['order']['food_item']['name'], result[index]['order']['quantity'], shoppinglist])
      }

      this.setState({orders: orders})
    }


    render() {

      var renderList = []
      console.log("Events", this.state.orders);
      for (var index in this.state.orders) {
        var todolist = [];
        for (var index2 in this.state.orders[index][2]) {
          var item = this.state.orders[index][2][index2]['packinglistitem']
          todolist.push(<Checkbox name={'None'} label={'________ ' + item['task']} value={0} />)
        }
        var renderItem = <div className="col-md-6"><div style={{'color':'#cb4154'}}><Header size={5} text={this.state.orders[index][0]}  /></div> {todolist} <br /></div>;
        renderList.push(renderItem);

      }

      var eventInfo = <div></div>
      if (this.state.loaded == true) {
        var eventInfo = <div className="row" style={{'marginTop':'30px','marginBottom':'30px'}}>
                          <table className="table">
                            <tr>
                              <th style={{'padding':'0px','border-top':'0px'}}>Event Name</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['name']}</td>
                              <th style={{'padding':'0px','border-top':'0px'}}>Customer Name</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['customer']['name']}</td>
                            </tr>
                            <tr>
                              <th style={{'padding':'0px','border-top':'0px'}}>Event Date</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['date']}</td>
                              <th style={{'padding':'0px','border-top':'0px'}}>Customer Phone</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['customer']['phone']}</td>
                            </tr>
                            <tr>
                              <th style={{'padding':'0px','border-top':'0px'}}>Arrival Time</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['arrival_time']}</td>
                              <th style={{'padding':'0px','border-top':'0px'}}>Customer Email</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['customer']['email']}</td>
                            </tr>
                            <tr>
                              <th style={{'padding':'0px','border-top':'0px'}}>Leave Kitchen Time</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['leave_time']}</td>
                              <th style={{'padding':'0px','border-top':'0px'}}>Location</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['address'] + ', ' + this.state.eventInfo['city'] + ' ' + this.state.eventInfo['state'] + ' ' + this.state.eventInfo['zip']}</td>
                            </tr>
                            <tr>
                              <th style={{'padding':'0px','border-top':'0px'}}>Occasion</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['occasion']}</td>
                              <th style={{'padding':'0px','border-top':'0px'}}>Customer Notes</th>
                              <td style={{'padding':'0px','border-top':'0px', 'maxWidth':'250px'}}>{this.state.eventInfo['customer']['notes']}</td>
                            </tr>
                            <tr>
                              <th style={{'padding':'0px','border-top':'0px'}}>Guest Count</th>
                              <td style={{'padding':'0px','border-top':'0px'}}>{this.state.eventInfo['guest_count']}</td>
                              <th style={{'padding':'0px','border-top':'0px'}}>Event Notes</th>
                              <td style={{'padding':'0px','border-top':'0px', 'maxWidth':'250px'}}>{this.state.eventInfo['notes']}</td>
                            </tr>
                          </table>
                        </div>;
      }

      var content =
        <div className='container'>
        <div style={{'marginTop':'25px'}}>
          <Button clickHandler={() => window.print()} type={'success'} text={'Print'} />
        </div>
          <Header css={{'padding':'50px','color':'#cb4154', 'text-align':'center'}} size={1} text={'Pack List for ' + this.state.eventInfo.name} />
          {eventInfo}
          <div style={{'marginTop':'35px','marginBottom':'50px'}}>
          <Header size={2} text={'Pack List'} />
          </div>
          <div className="row">
          {renderList}
          </div>
        </div>;



        return (
          <div>
            <Wrapper loaded={this.state.loaded}  content={content} />
          </div>
        );
    }
}

export default Customers;
