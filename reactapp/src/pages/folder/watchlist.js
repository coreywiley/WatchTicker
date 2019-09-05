import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, Header, FormWithChildren, TextInput, TableWithChildren, ListWithChildren, Paragraph, Button, Select} from 'library';
import ViewWatch from './viewwatch.js';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

class ChooseWatch extends Component {
    constructor(props) {
        super(props);
        this.choose_watch = this.choose_watch.bind(this);
    }

    choose_watch() {
        this.props.choose_watch(this.props.id)
    }

    render() {

        var style = {padding:'10px'}
        if (this.props.favorite) {
            style = {color:'yellow'}
        }

        return (
            <Button type={'Link'} text={this.props.reference_number} onClick={this.choose_watch} style={style}/>
        )
    }
}

class WatchList extends Component {
    constructor(props) {
        super(props);

        var id = 'a3b85dfa-5069-4983-8b57-f096850e6b49';


        if (isMobile) {
            id = null;
        }
        if (this.props.id) {
            id = this.props.id;
        }

        this.state = {'watch_id': id, key_val:0, favorite_watches: []}

        this.choose_watch = this.choose_watch.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.favorites = this.favorites.bind(this);
    }

    choose_watch(id) {
        this.setState({watch_id:id, key_val: this.state.key_val + 1})
    }

    componentDidMount() {
        this.refreshData()
    }

    refreshData() {
        ajaxWrapper('GET','/api/home/watch/?user_favorites=' + window.cmState.user.id, {}, this.favorites)
    }

    favorites(result) {
        var favorite_watches = [];
        for (var index in result) {
            favorite_watches.push(result[index]['watch'])
        }

        this.setState({favorite_watches: favorite_watches})
    }

    render() {

        var watch_brands = [{'text': 'All Brands', 'value': ''},{'text': 'Rolex', 'value': 'rolex'}, {'text': 'Audemars Piguet', 'value': 'audemars piguet'}, {'text': 'Breitling', 'value': 'breitling'}, {'text': 'Cartier Watch', 'value': 'cartier watch'}, {'text': 'Hublot', 'value': 'hublot'}, {'text': 'Iwc', 'value': 'iwc'}, {'text': 'A. Lange & Sohne', 'value': 'a. lange & sohne'}, {'text': 'Omega', 'value': 'omega'}, {'text': 'Panerai', 'value': 'panerai'}, {'text': 'Patek Philippe', 'value': 'patek philippe'}, {'text': 'Tag Heuer', 'value': 'tag heuer'}, {'text': 'Baume & Mercier', 'value': 'baume & mercier'}, {'text': 'Breguet', 'value': 'breguet'}, {'text': 'Bremont', 'value': 'bremont'}, {'text': 'Bvlgari/Bulgari', 'value': 'bvlgari/bulgari'}, {'text': 'Anonimo', 'value': 'anonimo'}, {'text': 'Armand Nicolet', 'value': 'armand nicolet'}, {'text': 'Cartier', 'value': 'cartier'}, {'text': 'Chanel', 'value': 'chanel'}, {'text': 'Chopard', 'value': 'chopard'}, {'text': 'Chronoswiss', 'value': 'chronoswiss'}, {'text': 'Corum', 'value': 'corum'}, {'text': 'Girard-Perregaux', 'value': 'girard-perregaux'}, {'text': 'Glashütte Original', 'value': 'glashütte original'}, {'text': 'Graham', 'value': 'graham'}, {'text': 'Heuer', 'value': 'heuer'}, {'text': 'Jaeger-Lecoultre', 'value': 'jaeger-lecoultre'}, {'text': 'Jaquet Droz', 'value': 'jaquet droz'}, {'text': 'Maurice Lacroix', 'value': 'maurice lacroix'}, {'text': 'Montblanc', 'value': 'montblanc'}, {'text': 'Nomos', 'value': 'nomos'}, {'text': 'Oris', 'value': 'oris'}, {'text': 'Piaget', 'value': 'piaget'}, {'text': 'Speake-Marin', 'value': 'speake-marin'}, {'text': 'Tudor', 'value': 'tudor'}, {'text': 'Ulysse Nardin', 'value': 'ulysse nardin'}, {'text': 'Vacheron Constantin', 'value': 'vacheron constantin'}, {'text': 'Zenith', 'value': 'zenith'}]

        var favorites_list = [];
        for (var index in this.state.favorite_watches) {
            var watch = this.state.favorite_watches[index];
            favorites_list.push(<ChooseWatch reference_number={watch['reference_number']} id={watch['id']} choose_watch={this.choose_watch} favorite={true} />)
        }

        if (isMobile) {
            if (this.state.watch_id) {
                var content = <div className="container-fluid"><ViewWatch key={this.state.key_val} watch_id={this.state.watch_id} choose_watch={this.choose_watch} favorites={this.state.favorite_watches} refreshData={this.refreshData} /></div>
            }
            else {
                var content = <div className="container-fluid"><FormWithChildren autoSetGlobalState={"true"} globalStateName={"filter"} style={{}} required={""} >
                    <Select name={"brand"} label={"Brand"} options={watch_brands} />
                    <TextInput name={"reference_number"} label={"Reference Number"} style={{}} required={""} />
                </FormWithChildren>
                <TableWithChildren required={""} headers={['Ref #']} order={"3"} className="table-hover">
                    {favorites_list}
                    <ListWithChildren limit={12} dataUrl={"/api/home/watch/"} objectName={"watch"} filters={resolveVariables({"text":{'model__icontains': '{filter.model}', 'brand__icontains': '{filter.brand}', 'reference_number__icontains': '{filter.reference_number}'}}, window.cmState.getGlobalState(this))["text"]} style={{}} required={""} table={"true"} tableStyle={{padding:'0px'}}>
                        <ChooseWatch reference_number={'{props.reference_number}'} id={'{props.id}'} choose_watch={this.choose_watch} />
                    </ListWithChildren>
                </TableWithChildren></div>
            }
        }
        else {
        var content = <div className="container-fluid">
        <div className="row">

        <div className="col-2">
        <FormWithChildren autoSetGlobalState={"true"} globalStateName={"filter"} style={{}} required={""} >
            <Select name={"brand"} label={"Brand"} options={watch_brands} />
            <TextInput name={"reference_number"} label={"Reference Number"} style={{}} required={""} />
        </FormWithChildren>
        <TableWithChildren required={""} headers={['Ref #']} order={"3"} className="table-hover">
            {favorites_list}
            <ListWithChildren limit={12} dataUrl={"/api/home/watch/"} objectName={"watch"} filters={resolveVariables({"text":{'model__icontains': '{filter.model}', 'brand__icontains': '{filter.brand}', 'reference_number__icontains': '{filter.reference_number}'}}, window.cmState.getGlobalState(this))["text"]} style={{}} required={""} table={"true"} tableStyle={{padding:'0px'}}>
                <ChooseWatch reference_number={'{props.reference_number}'} id={'{props.id}'} choose_watch={this.choose_watch} />
            </ListWithChildren>
        </TableWithChildren>
        </div>

        <div className="col-10">
            <ViewWatch key={this.state.key_val} watch_id={this.state.watch_id} choose_watch={this.choose_watch} favorites={this.state.favorite_watches} refreshData={this.refreshData} />
        </div>

            </div>
        </div>;
    }
    return (content);


    }
}
export default WatchList;
