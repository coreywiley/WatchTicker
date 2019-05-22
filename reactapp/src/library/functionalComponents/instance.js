import React, { Component } from 'react';
import {resolveVariables, ajaxWrapper} from 'functions';
import {Wrapper, NumberInput, TextInput, TextArea, CSSInput, Json_Input} from 'library';

class Instance extends Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [

                <TextInput label={'class'} name={'class'} />,
                <TextInput label={'dataUrl'} name={'dataUrl'} />,
                <TextInput label={'object name'} name={'objectName'} />,
                <Json_Input label={'dataMapping'} name={'dataMapping'} />,
                <TextInput label={'noDataMessage'} name={'noDataMessage'} />,
                <CSSInput label={'css'} name={'style'} default={{}} />,
            ],
            can_have_children: true,
        }

        this.state = {
            componentData: null,
            loaded:false,
        };

        this.ajaxCallback = this.ajaxCallback.bind(this);
        this.refreshData = this.refreshData.bind(this);
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData() {
        var dataUrl = resolveVariables({'dataUrl':this.props.dataUrl}, window.cmState.getGlobalState(this))['dataUrl'];
        ajaxWrapper("GET", dataUrl, {}, this.ajaxCallback);
    }

    ajaxCallback(result) {
        console.log("AJax Callback")
        console.log(result[0][this.props.objectName], result)
        if (result[0]) {
            this.setState({componentData:result[0][this.props.objectName], loaded:true})
        }
        else {
            this.setState({componentData:{}, loaded:true})
        }

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

        if (this.state.loaded) {
            var data = this.state.componentData;
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

              content.push(componentInstance);
            }
        }

        return (
            <Wrapper className={this.props.className} loaded={this.state.loaded} content={content} />
        );
    }
}

export default Instance;
