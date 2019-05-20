import React, { Component } from 'react';
import {resolveVariables, ajaxWrapper} from 'functions';
import {Wrapper, NumberInput, TextInput, TextArea, CSSInput, Json_Input, Button, Select} from 'library';

class ListWithChildren extends Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [

                <TextInput label={'class'} name={'class'} />,
                <TextArea label={'dataList'} name={'dataList'} />,
                <TextInput label={'dataUrl'} name={'dataUrl'} />,
                <TextInput label={'object name'} name={'objectName'} />,
                <Json_Input label={'dataMapping'} name={'dataMapping'} />,
                <Json_Input label={'filters'} name={'filters'} />,
                <TextInput label={'noDataMessage'} name={'noDataMessage'} />,
                <TextArea label={'lastInstanceData'} name={'lastInstanceData'} />,
                <Select label={'table'} name={'table'} options={[{'text':'True', value:true}, {'text':'False', value:false}]} defaultoption={false} />,
                <CSSInput label={'css'} name={'style'} default={{}} />,
            ],
            can_have_children: true,
        }

        var limit = this.props.limit || 20;
        this.state = {
            componentData: [],
            loaded:false,
            limit:limit,
            offset:0,
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
            this.setState({offset:0}, this.refreshData)
        }
    }

    refreshData() {
        var limit = this.state.limit;
        var offset = this.state.offset;
      if (this.props.dataUrl) {
        var dataUrl = resolveVariables({'dataUrl':this.props.dataUrl}, window.cmState.getGlobalState(this))['dataUrl'];

        var filterString = '';
        var filters = resolveVariables(this.props.filters, window.cmState.getGlobalState(this));
        if (filters) {
            for (var index in filters) {
                var filter = filters[index];
                if (filter.indexOf("undefined") == -1) {
                    filterString += '&' + index + '=' + filter;
                }
            }
        }

        if (dataUrl.indexOf('?') == -1) {
            dataUrl += '?limit=' + limit + '&offset=' + offset + filterString;
        }
        else {
            dataUrl += '&limit=' + limit + '&offset=' + offset + filterString;
        }

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
                var table_row = []
                var data = this.state.componentData[i][this.props.objectName];

                for (var index in children) {
                  var child = children[index]
                  var componentInstance;
                  if (this.props.dataMapping) {
                      var dataMapping = {...this.props.dataMapping};
                  }
                  else {
                      var dataMapping = {}
                  }

                  for (var prop_name in child.props) {
                      dataMapping[prop_name] = child.props[prop_name];
                  }

                  dataMapping = resolveVariables(dataMapping, {'props':data});

                  dataMapping['refreshData'] = this.refreshData;
                  dataMapping['setGlobalState'] = this.props.setGlobalState;

                  componentInstance = React.cloneElement(child, dataMapping);

                  if (this.props.table) {
                      table_row.push(<td>{componentInstance}</td>);
                  }
                  else {
                      content.push(componentInstance);
                  }

                }
                if (this.props.table) {
                    content.push(<tr>{table_row}</tr>)
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

              var componentInstance = React.cloneElement(child, data);
              content.push(componentInstance);
          }
        }

        content.push(<div style={{height:'50px'}}></div>)
        if (this.state.offset > 0) {
            var prev = <Button type={'primary'} text={'Previous'} onClick={() => this.setState({offset:this.state.offset - this.state.limit}, this.refreshData)} />
            content.push(prev)
        }

        if (this.state.componentData.length == this.state.limit) {
            var next = <Button type={'primary'} text={'Next'} onClick={() => this.setState({offset:this.state.offset + this.state.limit}, this.refreshData)} />
            content.push(next);
        }

        if (this.props.table && this.state.loaded) {
            return (content);
        }
        else {
            return (
                <Wrapper className={this.props.className} loaded={this.state.loaded} content={content} />
            );
        }

    }
}

export default ListWithChildren;
