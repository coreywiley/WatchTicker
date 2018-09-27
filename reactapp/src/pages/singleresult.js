import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from "base/ajax.js";
import {
    MapEmbed
} from 'library';

class SingleResultPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submission: null,
            loaded: true,
        };
    }

    componentDidMount() {
        this.getSubmission();
    }

    getSubmission() {
        var url = "/api/home/formsubmission/" + this.props.id + "/?related=form,form__elements,form__project,market";
        ajaxWrapper("GET",  url, {}, this.loadSubmission.bind(this));
    }

    loadSubmission(result){
        var sub = result[0]['formsubmission'];
        this.setState({
            submission: sub,
        });
    }

    render() {
        var sub = this.state.submission;
        var elements = {};
        var map = null;
        var content = null;

        if (sub){
            var placeId = this.state.submission['data']['placeId'];
            map = <MapEmbed centerAroundCurrentLocation={true} placeId={placeId} />;

            elements = sub.form['elements'];

            content =
            <div className='container resultPage'>
                <div className='row'>
                    <div className='col-12'>
                        <h2>{sub['form']['title']}</h2>
                        <h2><b>{sub['market']['name']}</b></h2>
                    </div>

                    <div className='col-6' style={{minHeight: "300px"}}>
                        {map}
                        <div className='floatingAddress'>
                            {sub.data['address']}
                        </div>
                    </div>
                    <div className='col-6 row' style={{textAlign: 'center'}}>
                        <div className='col-4'>
                            <div className='circle large'><div className="circleInner">{sub.data[elements[27]['formelement']['id']]}%</div></div>
                            <div>VACANCY<br/><b>RATE</b></div><br/>
                        </div>
                        <div className='col-4'>
                            <div className='circle'><div className="circleInner">
                                ${sub.data[elements[3]['formelement']['id']]} - ${sub.data[elements[4]['formelement']['id']]}<br/>PSF</div></div>
                            <div>AVG. ASKING<br/><b>RATE</b></div><br/>
                        </div>
                        <div className='col-4'>
                            <div className='circle'><div className="circleInner">{sub.data[elements[8]['formelement']['id']]}</div></div>
                            <div>YTD NET<br/><b>ABSORPTION</b></div><br/>
                        </div>

                        <div className='col-4'>
                            <div className='circle'><div className="circleInner light">{sub.data[elements[7]['formelement']['id']]}</div></div>
                            <div>OCCUPIER<br/><b>STATUS</b></div><br/>
                        </div>
                        <div className='col-4'>
                            <div className='circle'><div className="circleInner light">{sub.data[elements[6]['formelement']['id']]}</div></div>
                            <div>PROPERTY<br/><b>TYPE</b></div><br/>
                        </div>
                        <div className='col-4'>
                            <div className='circle large'><div className="circleInner light">{sub.data[elements[5]['formelement']['id']]}</div></div>
                            <div>PROPERTY<br/><b>CLASS</b></div><br/>
                        </div>
                    </div>

                    <div className='col-12 row'>
                        <div className='col-12'><br/></div>
                        <div className='col-4'>
                            <img style={{float:'left', width:'50px'}} src='/static/images/property.png' />
                            <div style={{margin:"6px 0px 0px", fontWeight:'bold'}}>PROPERTY<br/>DETAILS</div>

                            <table className='table' style={{fontSize:'12px'}}>
                              <tbody>
                                <tr>
                                    <td>WAREHOUSE SF</td>
                                    <td>{sub.data[elements[9]['formelement']['id']]}</td>
                                </tr>
                                <tr>
                                    <td>OFFICE SF</td>
                                    <td>{sub.data[elements[11]['formelement']['id']] -
                                        sub.data[elements[9]['formelement']['id']] -
                                        sub.data[elements[10]['formelement']['id']]}</td>
                                </tr>
                                <tr>
                                    <td>FLAMMABLES ROOM</td>
                                    <td>{sub.data[elements[10]['formelement']['id']]}</td>
                                </tr>
                                <tr>
                                    <td>TOTAL SF</td>
                                    <td>{sub.data[elements[11]['formelement']['id']]}</td>
                                </tr>
                                <tr>
                                    <td>CLEAR HEIGHT</td>
                                    <td>{sub.data[elements[12]['formelement']['id']]}</td>
                                </tr>
                                <tr>
                                    <td>TOTAL PARCEL SIZE</td>
                                    <td>{sub.data[elements[13]['formelement']['id']]}</td>
                                </tr>
                                <tr>
                                    <td>ZONING</td>
                                    <td>{sub.data[elements[14]['formelement']['id']]}</td>
                                </tr>
                              </tbody>
                            </table>
                        </div>

                        <div className='col-4'>
                            <img style={{float:'left', width:'50px'}} src='/static/images/market.png' />
                            <div style={{margin:"6px 0px 0px", fontWeight:'bold'}}>MARKET<br/>SALES</div>

                            <table className='table' style={{fontSize:'12px'}}>
                              <tbody>
                                <tr style={{background:'rgb(215,227,189)', textAlign:'right'}}>
                                    <td colSpan='2'>VACANT SALE</td>
                                </tr>
                                <tr>
                                    <td>ESTIMATED SALE VALUE / SF</td>
                                    <td>${sub.data[elements[15]['formelement']['id']]} - ${sub.data[elements[16]['formelement']['id']]}</td>
                                </tr>
                                <tr>
                                    <td>ESTIMATED SALE VALUE</td>
                                    <td>${sub.data[elements[17]['formelement']['id']]}</td>
                                </tr>
                                <tr style={{background:'rgb(215,227,189)', textAlign:'right'}}>
                                    <td colSpan='2'>10-YEAR SALE LEASEBACK</td>
                                </tr>
                                <tr>
                                    <td>ESTIMATED SALE VALUE / SF</td>
                                    <td>${sub.data[elements[18]['formelement']['id']]} - ${sub.data[elements[19]['formelement']['id']]}</td>
                                </tr>
                                <tr>
                                    <td>ESTIMATED SALE VALUE</td>
                                    <td>${sub.data[elements[20]['formelement']['id']]} - ${sub.data[elements[21]['formelement']['id']]}</td>
                                </tr>
                                <tr>
                                    <td>ASSUMED RENTAL RATE FOR LEASEBACK</td>
                                    <td>${sub.data[elements[22]['formelement']['id']]}</td>
                                </tr>
                              </tbody>
                            </table>
                        </div>

                        <div className='col-4'>
                            <img style={{float:'left', width:'50px'}} src='/static/images/leases.png' />
                            <div style={{margin:"6px 0px 0px", fontWeight:'bold'}}>MARKET<br/>LEASES</div>

                            <table className='table' style={{fontSize:'12px'}}>
                              <tbody>
                                <tr>
                                    <td>Current Market Annual Operating/NNN Expenses</td>
                                    <td>{sub.data[elements[23]['formelement']['id']]}</td>
                                </tr>
                              </tbody>
                            </table>

                            <div style={{margin:"6px 0px 0px", fontWeight:'bold'}}>COMMENTS</div>

                            <div>{sub.data[elements[28]['formelement']['id']]}</div>
                        </div>
                    </div>

                    <div className='col-12'>
                        <div style={{margin:"6px 0px 0px", fontWeight:'bold'}}>LOCAL MARKET CYCLE</div>
                        <img src='/static/images/cycle.png' />
                        <br/><br/><br/>
                    </div>
                </div>

            </div>;
        }

        return (
            <Wrapper token={this.props.user_id} loaded={this.state.loaded}  content={content} />
        );
    }
}



export default SingleResultPage;
