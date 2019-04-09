import React, { Component } from 'react';
import {resolveVariables, ajaxWrapper} from 'functions';
import {Wrapper, ChildComponent, NumberInput, TextInput, TextArea, CSSInput, AddChildComponent} from 'library';

//Example
//var lastInstanceData = {'name':"Something New?", 'description':"Add A New Component", 'link':"/component/", 'button':"Create New", 'button_type':"success"};
//var dataMapping = {'button_type':'primary', 'button':'Edit', 'link':'/component/{id}/'};
//<List dataUrl={"/api/home/component/"} component={Card} objectName={'component'} dataMapping={dataMapping} lastInstanceData={lastInstanceData} />

class ListWithChildren extends Component {
    static config = {
        form_components: [
            <NumberInput label={'order'} name={'order'} />,
            <TextInput label={'class'} name={'class'} />,
            <TextArea label={'dataList'} name={'dataList'} />,
            <TextInput label={'dataUrl'} name={'dataUrl'} />,
            <TextArea label={'dataMapping'} name={'dataMapping'} />,
            <TextInput label={'noDataMessage'} name={'noDataMessage'} />,
            <TextArea label={'lastInstanceData'} name={'lastInstanceData'} />,
            <CSSInput label={'css'} name={'style'} default={{}} />,
        ],
        can_have_children: true,
    }

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
