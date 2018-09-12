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
      ajaxWrapper('GET','/api/home/order/?related=food_item,food_item__decoration_list&event=' + this.props.event_id, {}, this.eventCallback)
    }

    eventInfoCallback(result) {
      this.setState({eventInfo: result[0]['event'], loaded:true})
    }

    eventCallback(result) {

      var orders = [];
      for (var index in result) {
        var shoppinglist = result[index]['order']['food_item']['decoration_list']
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
          var item = this.state.orders[index][2][index2]['decorationlistitem']
          todolist.push(<Checkbox name={'None'} label={item['task']} value={0} />)
        }
        var renderItem = <div className="col-md-4"><Header size={5} text={this.state.orders[index][0] + ' : ' + this.state.orders[index][1]} /><br /> {todolist} <br /></div>;
        renderList.push(renderItem);

      }

      var eventInfo = <div></div>
      if (this.state.loaded == true) {
      var eventInfo = <div className="row">
                        <div className="col-md-8">
                          <p><strong>Event Name: </strong>{this.state.eventInfo['name']}</p>
                          <p><strong>Event Date: </strong>{this.state.eventInfo['date']}</p>
                          <p><strong>Arrival Time: </strong>{this.state.eventInfo['arrival_time']}</p>
                          <p><strong>Leave Kitchen Time: </strong>{this.state.eventInfo['leave_time']}</p>
                          <p><strong>Occasion: </strong>{this.state.eventInfo['occasion']}</p>
                          <p><strong>Guest Count: </strong>{this.state.eventInfo['guest_count']}</p>
                        </div>
                        <div className="col-md-4">
                          <p><strong>Customer Name: </strong>{this.state.eventInfo['customer']['name']}</p>
                          <p><strong>Customer Phone: </strong>{this.state.eventInfo['customer']['phone']}</p>
                          <p><strong>Customer Email: </strong>{this.state.eventInfo['customer']['email']}</p>
                          <p><strong>Location: </strong>{this.state.eventInfo['location']}</p>
                        </div>
                      </div>;
      }

      var content =
        <div className='container'>
          <Header size={2} text={'Decoration List for ' + this.state.eventInfo.name} />
          {eventInfo}
          <Header size={4} text={'Decoration List'} />
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
