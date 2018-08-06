import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';
import ajaxWrapper from 'base/ajax.js';
import Wrapper from 'base/wrapper.js';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            componentData: [],
            loaded:false,
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
        this.refreshData = this.refreshData.bind(this);
    }

    componentDidMount() {
        if (this.props.dataList) {
            this.setState({componentData: this.props.dataList, loaded:true})
        } else {
            this.refreshData();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.refreshData();
    }

    refreshData() {
        var dataUrl = this.props.dataUrl;
        if (this.props.filters) {
            if (dataUrl.indexOf('?') == -1) {
                dataUrl += '?';
            }
            for (var key in this.props.filters) {
                if (typeof this.props.filters[key] == 'object') {
                    if (this.props.filters[key].length > 0) {
                        var tempFilter = this.props.filters[key].join();
                        dataUrl += '&' + key + '=' + tempFilter
                    }
                }
                else if (this.props.filters[key] != '') {
                    dataUrl += '&' + key + '=' + this.props.filters[key]
                }
            }
        }
        ajaxWrapper("GET", dataUrl, {}, this.ajaxCallback);
    }

    ajaxCallback(value) {
        console.log(value);
        this.setState({componentData:value, loaded:true})
    }


    render() {
        let Component = this.props.component;
        var content = [];
        if (this.props.title) {
            content.push(this.props.title);
        }

        if (this.state.componentData.length > 0) {
            for (var i = 0; i < this.state.componentData.length; i++) {
                var data = this.state.componentData[i][this.props.objectName];

                var componentInstance;
                if (this.props.dataMapping) {
                    var dataMapping = {...this.props.dataMapping};
                    dataMapping = resolveVariables(dataMapping, data);

                    componentInstance = <Component key={data.id} {...dataMapping} refreshData={this.refreshData} setGlobalState={this.props.setGlobalState} />;
                }
                else {
                    componentInstance = <Component key={data.id} {...data} refreshData={this.refreshData} setGlobalState={this.props.setGlobalState} />;
                }
                //console.log("Key " + data.id, dataMapping);


                content.push(componentInstance);
            }
        }
        else if (this.props.lastInstanceData == undefined) {
            var noDataMessage = 'None Found';
            if (this.props.noDataMessage) {
                noDataMessage = this.props.noDataMessage;
            }
            content.push(<p>{noDataMessage}</p>);
        }

        if (this.props.lastInstanceData) {
            var componentInstance = <Component {...this.props.lastInstanceData}
                refreshData={this.refreshData} setGlobalState={this.props.setGlobalState} />;
            content.push(componentInstance);
        }

        return (
            <Wrapper className={this.props.className} loaded={this.state.loaded} content={content} />
        );
    }
}

export default List;
