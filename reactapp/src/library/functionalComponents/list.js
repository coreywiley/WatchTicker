import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {ajaxWrapper} from 'functions';
import {Wrapper} from 'library';
//Example
//var lastInstanceData = {'name':"Something New?", 'description':"Add A New Component", 'link':"/component/", 'button':"Create New", 'button_type':"success"};
//var dataMapping = {'button_type':'primary', 'button':'Edit', 'link':'/component/{id}/'};
//<List dataUrl={"/api/home/component/"} component={Card} objectName={'component'} dataMapping={dataMapping} lastInstanceData={lastInstanceData} />

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            componentData: [],
            loaded:false,
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
        this.refreshData = this.refreshData.bind(this);
        console.log("Original", this.props.dataUrl)
    }

    componentDidMount() {
        if (this.props.dataList) {
            this.setState({componentData: this.props.dataList, loaded:true})
        } else {
            this.refreshData();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.dataList) {
            this.refreshData();
        }
    }

    refreshData() {
        var dataUrl = this.props.dataUrl;
        ajaxWrapper("GET", dataUrl, {}, this.ajaxCallback);
    }

    ajaxCallback(value) {
        console.log("List Callback", value);
        this.setState({componentData:value, loaded:true})
    }


    render() {
        let Component = this.props.component;
        var content = [];

        if (this.state.componentData.length > 0) {
            for (var i = 0; i < this.state.componentData.length; i++) {
                var data = this.state.componentData[i][this.props.objectName];
                console.log("Data",data, this.props.objectName);
                var componentInstance;
                if (this.props.dataMapping) {
                    var dataMapping = {...this.props.dataMapping};
                    dataMapping = resolveVariables(dataMapping, data);
                    componentInstance = <Component key={data.id} {...dataMapping} refreshData={this.refreshData} setGlobalState={this.props.setGlobalState} />;
                }
                else {
                    componentInstance = <Component key={data.id} {...data} refreshData={this.refreshData} setGlobalState={this.props.setGlobalState} />;
                }

                content.push(componentInstance);
            }
        }
        else if (this.props.lastInstanceData == undefined) {
            var noDataMessage = 'No ' + this.props.objectName + 's Found';
            if (this.props.noDataMessage) {
                noDataMessage = this.props.noDataMessage;
            }
            content.push(<p>{noDataMessage}</p>);
        }

        if (this.props.lastInstanceData) {
            var componentInstance = <Component {...this.props.lastInstanceData} refreshData={this.refreshData} setGlobalState={this.props.setGlobalState} />;
            content.push(componentInstance);
        }

        return (
            <Wrapper className={this.props.className} loaded={this.state.loaded} content={content} />
        );
    }
}

export default List;
