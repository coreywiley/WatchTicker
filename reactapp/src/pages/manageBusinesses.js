import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';

import {Form, TextInput, Select, PasswordInput, Navbar, NumberInput, GoogleAddress, Button} from 'library';
import Card from 'projectLibrary/businessCard.js';
class Businesses extends Component {

  constructor(props) {
    super(props);
    this.state = {'businesses':[], filters:{'type':'', 'city':'', 'state':''}, 'loaded':false};

    this.businessCallback = this.businessCallback.bind(this);
    this.setGlobalState = this.setGlobalState.bind(this);
  }

    componentDidMount() {
        this.businessRefresh()
    }

    businessRefresh() {
      ajaxWrapper('GET','/api/home/business/', {}, this.businessCallback)
    }

    businessCallback(result) {
      var businesses = [];
      for (var index in result) {
        businesses.push(result[index]['business'])
      }
      this.setState({businesses:businesses, loaded:true})
    }

    setGlobalState(name, value) {
      var newState = {}
      newState[name] = value
       this.setState(newState)
    }

    publish(id, email) {
      ajaxWrapper('POST','/api/email/',{'to_email': email, 'from_email': 'jeremy.thiesen1@gmail.com', 'subject':'Your business was published PatronGate', 'text': 'We are excited to tell you we have published your business from PatronGate. Please follow up with this email to ask any questions and you are welcome to check out <a href="localhost:8000/business/' + id + '/">your business page.</a>'})
      ajaxWrapper('POST', '/api/home/business/' + id + '/', {'published':true, 'rejected':false, 'ask_for_publish':false}, this.businessRefresh)
    }

    unpublish(id, email) {
      ajaxWrapper('POST','/api/email/',{'to_email': email, 'from_email': 'jeremy.thiesen1@gmail.com', 'subject':'Your business has been un-published from PatronGate', 'text': 'We are sorry to tell you we have unpublished your business from PatronGate. Please follow up with this email to ask any questions and you are welcome to reappply via <a href="localhost:8000/business/' + id + '/">your business page.</a>'})
      ajaxWrapper('POST', '/api/home/business/' + id + '/', {'published':false, 'rejected':false, 'ask_for_publish':false}, this.businessRefresh)
    }

    reject(id, email) {
      ajaxWrapper('POST','/api/email/',{'to_email': email, 'from_email': 'jeremy.thiesen1@gmail.com', 'subject':'Your business has been rejected from PatronGate', 'text': 'We are sorry to tell you we have rejected your business from PatronGate. Please follow up with this email to ask any questions and you are welcome to reappply via <a href="localhost:8000/business/' + id + '/">your business page.</a>'})
      ajaxWrapper('POST', '/api/home/business/' + id + '/', {'published':false, 'rejected':true, 'ask_for_publish': false}, this.businessRefresh)
    }

    render() {
      if (this.state.loaded) {
        var publishedTableRows = [];
        var unpublishedTableRows = [];
        var rejectedTableRows = [];
        var workingOnTableRows = [];

        for (var index in this.state.businesses) {
          var business = this.state.businesses[index];
          if (business.published == true) {
            publishedTableRows.push(<tr>
                <td>{business.name}</td>
                <td>{business.email}</td>
                <td><Button text={'View Page'} href={'/business/' + business.id + '/'} type={'primary'} /></td>
                <td><Button text={'Un-Publish'} href={() => this.unpublish(business.id, business.email)} type={'danger'} /></td>
                <td><Button text={'Reject'} href={() => this.reject(business.id, business.email)} type={'danger'} /></td>
                </tr>)
          }
          else if (business.published == false && business.ask_for_publish == true) {
            unpublishedTableRows.push(<tr>
                <td>{business.name}</td>
                <td>{business.email}</td>
                <td><Button text={'View Page'} href={'/business/' + business.id + '/'} type={'primary'} /></td>
                <td><Button text={'Publish'} href={() => this.publish(business.id, business.email)} type={'success'} /></td>
                <td><Button text={'Reject'} href={() => this.reject(business.id, business.email)} type={'danger'} /></td>
                </tr>)
          }
          else if (business.rejected == true) {
            rejectedTableRows.push(<tr>
                <td>{business.name}</td>
                <td>{business.email}</td>
                <td><Button text={'View Page'} href={'/business/' + business.id + '/'} type={'primary'} /></td>
                <td><Button text={'Publish'} href={() => this.publish(business.id, business.email)} type={'success'} /></td>
                </tr>)
          }
          else {
            workingOnTableRows.push(<tr>
                <td>{business.name}</td>
                <td>{business.email}</td>
                <td><Button text={'View Page'} href={'/business/' + business.id + '/'} type={'primary'} /></td>
                </tr>)
          }

        }

          var content = <div className="container">
          <MetaTags>
            <title>Manage Businesses | PatronGate</title>
            <meta property="og:title" content="Manage Businesses | PatronGate" />
          </MetaTags>
                  <h1>Manage Businesses on Patron Gate</h1>
                  <Button type={'success'} href={'/couponMetrics/'} text={'View All Coupon Redemptions'} />
                  <br />
                  <h3>Businesses Looking To Be Published</h3>
                  <div style={{'overflowX':'scroll'}}>
                    <table>
                      <tr>
                        <th>Business Name</th>
                        <th>Email</th>
                        <th>View Their Page</th>
                        <th>Publish</th>
                        <th>Reject Application</th>
                      </tr>
                      {unpublishedTableRows}
                    </table>
                  </div>
                  <br /><br />
                  <h3>Businesses Working On Their Page</h3>
                  <div style={{'overflowX':'scroll'}}>
                    <table>
                      <tr>
                        <th>Business Name</th>
                        <th>Email</th>
                        <th>View Their Page</th>
                      </tr>
                      {workingOnTableRows}
                    </table>
                  </div>
                  <br /><br />
                  <h3>Rejected Businesses</h3>
                  <div style={{'overflowX':'scroll'}}>
                    <table>
                      <tr>
                        <th>Business Name</th>
                        <th>Email</th>
                        <th>View Their Page</th>
                        <th>Publish</th>
                      </tr>
                      {rejectedTableRows}
                    </table>
                  </div>
                  <br /><br />
                  <h3>Published Businesses</h3>
                  <div style={{'overflowX':'scroll'}}>
                    <table>
                      <tr>
                        <th>Business Name</th>
                        <th>Email</th>
                        <th>View Their Page</th>
                        <th>Un Publish</th>
                        <th>Reject</th>
                      </tr>
                      {publishedTableRows}
                    </table>
                  </div>

          </div>;
      }
      else {
        content = <div></div>
      }

        return (
            <Wrapper loaded={this.state.loaded} content={content} />
             );
    }
}
export default Businesses;
