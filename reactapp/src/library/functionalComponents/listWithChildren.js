import React, { Component } from 'react';
import {resolveVariables, ajaxWrapper} from 'functions';
import {Wrapper, ChildComponent} from 'library';

class ListWithChildren extends Component {
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
        if (!this.props.dataList) {
            this.refreshData();
        }
    }

    refreshData() {
      if (this.props.dataUrl) {
        var dataUrl = resolveVariables({'dataUrl':this.props.dataUrl}, window.cmState.getGlobalState())['dataUrl'];
        ajaxWrapper("GET", dataUrl, {}, this.ajaxCallback);
      }
    }

    ajaxCallback(value) {
        console.log("List Callback", value);
        this.setState({componentData:value, loaded:true})
    }


    render() {
        var children = [];
        if (this.props.children != undefined) {
          //weirdly enough this means more than one child
          if (this.props.children.length > 0) {
            for (var index in this.props.children) {
                var child = this.props.children[index];
                children.push(child)
            }
          }
          else {
            var child = this.props.children
            console.log("Child", child)
            if (child.length != 0) {
              children.push(child);
            }
          }
        }

        var content = [];

        if (this.state.componentData.length > 0) {
            for (var i in this.state.componentData) {
                var data = this.state.componentData[i][this.props.objectName];

                for (var index in children) {
                  var child = children[index]
                  var componentInstance;
                  if (this.props.dataMapping) {
                      var dataMapping = {...this.props.dataMapping};
                      dataMapping = resolveVariables(dataMapping, data);
                      dataMapping['refreshData'] = this.refreshData;
                      dataMapping['setGlobalState'] = this.props.setGlobalState;
                      componentInstance = <ChildComponent component={child} newProps={dataMapping} />;
                  }
                  else {
                      data['refreshData'] = this.refreshData;
                      data['setGlobalState'] = this.props.setGlobalState;
                      componentInstance = <ChildComponent component={child} newProps={data} />;
                  }

                  content.push(componentInstance);
                }
            }
        }
        else if (this.props.lastInstanceData == undefined) {
            var noDataMessage = this.props.noDataMessage || 'No ' + this.props.objectName + 's Found';
            content.push(<p>{noDataMessage}</p>);
        }

        if (this.props.lastInstanceData) {
            for (var index in children) {
              var child = children[index];
              var data = this.props.lastInstanceData;
              data['refreshData'] = this.refreshData;
              data['setGlobalState'] = this.props.setGlobalState;

              var componentInstance = <ChildComponent key={data.id} component={child} newProps={data} />;
              content.push(componentInstance);
          }
        }


        return (
            <Wrapper className={this.props.className} loaded={this.state.loaded} content={content} />
        );
    }
}

export default ListWithChildren;
