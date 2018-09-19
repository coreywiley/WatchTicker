import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';
import ajaxWrapper from "base/ajax.js";

//Example
//var answerProps = {'name':'response', 'value':''}
//var defaults = {'response':'', 'question':this.props.question_id, 'sid':this.props.user_id}
//var submitUrl = '/api/home/answer/';
//var redirectUrl = '/referenceGuide/' + this.props.question_id + '/';
//<Form components={[TextArea]} first={true} componentProps={[answerProps]} submitUrl={submitUrl} defaults={defaults} redirectUrl={redirectUrl}/>

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.defaults;

        this.handleChange = this.handleChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.formDelete = this.formDelete.bind(this);
        this.formSubmitCallback = this.formSubmitCallback.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.setFormState = this.setFormState.bind(this);
        this.refreshDataCallback = this.refreshDataCallback.bind(this);
        this.setGlobalState = this.setGlobalState.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidMount() {
        console.log("Data URL", this.props.dataUrl);
        if (this.props.dataUrl) {
            this.refreshData();
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("Will Receive Props");
        this.setState(nextProps.defaults)
    }

    setGlobalState(state) {
        console.log("New Global State", state)
        if (this.props.autoSetGlobalState == true) {
            this.props.setGlobalState(this.props.globalStateName,state)
        }
    }

    handleChange = (e) => {
       var name = e.target.getAttribute("name");
       var newState = {};
       newState[name] = e.target.value;

        var newCompleteState = this.state;
        newCompleteState[name] = e.target.value;
       this.setState(newState, this.setGlobalState(newCompleteState));
    }

    setFormState(state) {
        console.log("Set Form State",state)
        this.setState(state,  this.setGlobalState(state));

    }

    refreshData() {
        console.log("Refresh Data", this.props.dataUrl);
        if (this.props.dataUrl) {
            ajaxWrapper("GET",this.props.dataUrl, {}, this.refreshDataCallback);
        }
    }

    formSubmit() {
        console.log("Submitting", this.state, this.props.submitUrl);
        var data = this.state;
        for (var item in data) {
            if (item.endsWith('[]')) {
                console.log("STRINGIFY")
                data[item] = JSON.stringify(data[item]);
                console.log(item,data[item])
            }
        }

        ajaxWrapper("POST",this.props.submitUrl, data, this.formSubmitCallback);
    }

    refreshDataCallback(value) {
        console.log("Form Data",value, this.props.objectName)
        var newValue = value;
        if (this.props.first == true) {
            if (this.props.objectName) {
                newValue = value[0][this.props.objectName]
            }
            else {
                newValue = value[0];
            }
        }
        if (this.props.dataMapping) {
            if (value.length != undefined) {
                newValue = {'photos[]':[]}
                for (var index in value) {
                    console.log("DataMapping",value[index], this.props.dataMapping)
                    var tempValue = resolveVariables(this.props.dataMapping, value[index]);
                    console.log("temp value",tempValue)
                    newValue['photos[]'].push(tempValue['photos[]']);
                }
            }
            else {
                newValue = resolveVariables(this.props.dataMapping, value);
            }
            console.log("Data Mapped", newValue)
        }


        this.setState(newValue)

    }

    formSubmitCallback (value) {
        console.log("Value",value);


            if (this.props.setGlobalState) {
                if (this.props.globalStateName) {
                    this.setState(value[0][this.props.objectName], () => this.props.setGlobalState(this.props.globalStateName,this.state));
                } else {
                    this.setState(value[0][this.props.objectName], this.props.setGlobalState('Form',this.state));
                }
            } else {
                this.setState(value[0][this.props.objectName]);
            }

        if (this.props.redirectUrl) {
            if (this.props.objectName) {
                 var redirectUrl = resolveVariables({'redirectUrl':this.props.redirectUrl}, value[0][this.props.objectName]);
            }
            else {
                var redirectUrl = resolveVariables({'redirectUrl':this.props.redirectUrl}, value);
            }

            window.location.href = redirectUrl['redirectUrl'];
        }

        if (this.props.redirect) {
            value['form_state'] = this.state;
            this.props.redirect(value);
        }
        else if (this.props.refreshData) {
            this.props.refreshData();
        }
    }

    formDelete() {
        ajaxWrapper("POST",this.props.deleteUrl, {}, this.formSubmitCallback.bind(this));
    }

    handleKeyPress = (event) => {
      if(event.key == 'Enter'){
        this.formSubmit()
      }
    }

    render() {
        var layout = "";
        if (typeof(this.props.layout) != 'undefined') {
            layout = this.props.layout
        }

        var classCss = "form";
        if (this.props.row == true) {
            classCss ="form-row";
        }
        if (this.props.classCss != undefined) {
            classCss = this.props.classCss;
        }


        let components = [];

        for (var index in this.props.components) {
            var Component = this.props.components[index];
            var props = this.props.componentProps[index];
            if (index == 0) {
              props['autoFocus'] = true;
            }

            if (props['names']) {
                var values = {}
                for (var nameIndex in props['names']) {
                    var name = props['names'][nameIndex];
                    values[name] = this.state[name]
                }
                components.push(<Component {...props} handlechange={this.handleChange} setFormState={this.setFormState} {...values} />)
            }
            else {
                components.push(<Component {...props} handlechange={this.handleChange} setFormState={this.setFormState} value={this.state[props['name']]} />)
            }
        }

        var buttons = [];
        if (this.props.submitUrl) {
            var submitButton = <button className="btn btn-primary" onClick={this.formSubmit}>Save</button>
            buttons.push(submitButton);
        }

        if (this.props.deleteUrl) {
            var deleteButton = <button className="btn btn-danger" onClick={this.formDelete}>Delete</button>
            buttons.push(deleteButton);
        }

        //need to add in formsubmit, delete, and handle change functions to components.
        return(
            <div className={layout}  style={this.props.css} onKeyPress={this.handleKeyPress}>
                {components}
                {buttons}
            </div>
        )
    }
}

export default Form;
