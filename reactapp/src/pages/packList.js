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
        var renderItem = <div className="col-md-4"><div style={{'color':'#cb4154'}}><Header size={5} text={this.state.orders[index][0]}  /></div> {todolist} <br /></div>;
        renderList.push(renderItem);

      }

      var eventInfo = <div></div>
      if (this.state.loaded == true) {
      var eventInfo = <div className="row">
                        <div className="col-md-8">
                          <p style={{'margin':'0'}}><strong>Event Name: </strong>{this.state.eventInfo['name']}</p>
                          <p style={{'margin':'0'}}><strong>Event Date: </strong>{this.state.eventInfo['date']}</p>
                          <p style={{'margin':'0'}}><strong>Arrival Time: </strong>{this.state.eventInfo['arrival_time']}</p>
                          <p style={{'margin':'0'}}><strong>Leave Kitchen Time: </strong>{this.state.eventInfo['leave_time']}</p>
                          <p style={{'margin':'0'}}><strong>Occasion: </strong>{this.state.eventInfo['occasion']}</p>
                          <p style={{'margin':'0'}}><strong>Guest Count: </strong>{this.state.eventInfo['guest_count']}</p>
                        </div>
                        <div className="col-md-4">
                          <p style={{'margin':'0'}}><strong>Customer Name: </strong>{this.state.eventInfo['customer']['name']}</p>
                          <p style={{'margin':'0'}}><strong>Customer Phone: </strong>{this.state.eventInfo['customer']['phone']}</p>
                          <p style={{'margin':'0'}}><strong>Customer Email: </strong>{this.state.eventInfo['customer']['email']}</p>
                          <p style={{'margin':'0'}}><strong>Location: </strong>{this.state.eventInfo['location']}</p>
                          <p style={{'margin':'0'}}><strong>Customer Notes: </strong>{this.state.eventInfo['customer']['notes']}</p>
                          <p style={{'margin':'0'}}><strong>Event Notes: </strong>{this.state.eventInfo['notes']}</p>
                        </div>
                      </div>;
      }

      var content =
        <div className='container'>
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
