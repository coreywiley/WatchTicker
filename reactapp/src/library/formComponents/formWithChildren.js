import React, { Component } from 'react';
import {resolveVariables, ajaxWrapper, run_functions} from 'functions';
import {Alert, Button, TextInput, NumberInput, CSSInput, Json_Input, Select, Function_Input} from 'library';

/*
Example


*/

function get_children(obj, defaults) {
    var children = [];
    var children_props = [];

    if (obj.props && obj.props.children != undefined) {
        //weirdly enough this means more than one child
        if (obj.props.children.length > 0) {
            children_props = obj.props.children
        }
        else {
            children_props = [obj.props.children]
        }
    }

    for (var index in children_props) {
        var child = children_props[index];
        children.push(child)
        if (child.props && child.props.default) {
          console.log("Default Setting", child.props.name, child.props.default)
          if (!obj.state || !obj.state[child.props.name]) {
              defaults[child.props.name] = child.props.default;
          }
        }
    }

    defaults['required'] = '';
    defaults['children'] = children;

    return [children, defaults]
}

class FormWithChildren extends Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <TextInput label={'submitUrl'} name={'submitUrl'} />,
                <TextInput label={'redirectUrl'} name={'redirectUrl'} />,
                <TextInput label={'deleteUrl'} name={'deleteUrl'} />,
                <TextInput label={'deleteRedirectUrl'} name={'deleteRedirectUrl'} />,
                <Json_Input label={'defaults'} name={'defaults'} />,
                <TextInput label={'objectName'} name={'objectName'} />,
                <Select label={'autoSetGlobalState'} name={'autoSetGlobalState'} options={[{'text':'True', value:true}, {'text':'False', value:false}]} defaultoption={false} />,
                <Select label={'row'} name={'row'} options={[{'text':'True', value:true}, {'text':'False', value:false}]} defaultoption={false} />,
                <TextInput label={'globalStateName'} name={'globalStateName'} />,
                <Function_Input label={'Add Function On Submit'} default={''} name={'functions'} />,
                <CSSInput label={'css'} name={'style'} default={{}} />,
            ],
            can_have_children: true,
        }

        var defaults = {};
        if (this.props && this.props.defaults) {
          defaults = resolveVariables(this.props.defaults, window.cmState.getGlobalState())
        }

        var childrendefaults = get_children(this, defaults)
        var children = childrendefaults[0];
        defaults = childrendefaults[1];

        this.state = defaults;

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
        var new_defaults = nextProps.defaults || {};
        if (nextProps.defaults) {
          new_defaults = resolveVariables(nextProps.defaults, window.cmState.getGlobalState())
        }

        console.log("Component Will Receive Props Called", nextProps.defaults, new_defaults)

        var defaults = {}
        for (var key in new_defaults){
            if (!(key in this.state)){
                defaults[key] = new_defaults[key];
            }
        }

        var childrendefaults = get_children(this, defaults)
        var children = childrendefaults[0];
        defaults = childrendefaults[1];

        console.log("Setting State", new_defaults, defaults)
        this.setState(defaults);
    }



    setGlobalState(state) {
        console.log("Set Global State Trigger")
        if (this.props.autoSetGlobalState == true || this.props.autoSetGlobalState == "true") {
            window.cmState.setGlobalState(this.props.globalStateName, state);
            this.props.setGlobalState(this.props.globalStateName,state)
        }
    }

    handleChange = (e) => {
       var name = e.target.getAttribute("name");
       var newState = {};
       newState[name] = e.target.value;

        var newCompleteState = this.state;
        newCompleteState[name] = e.target.value;
        console.log("Different States", newState, newCompleteState)
       this.setState(newState, this.setGlobalState(newCompleteState));
    }

    setFormState(state) {
        var newState = this.state;
        for (var index in state) {
          newState[index] = state[index];
        }
        this.setState(state,  this.setGlobalState(newState));

    }

    refreshData() {
        console.log("Refresh Data", this.props.dataUrl);
        if (this.props.dataUrl) {
            ajaxWrapper("GET",this.props.dataUrl, {}, this.refreshDataCallback);
        }
    }

    formSubmit() {
        console.log("Submitting", this.state, this.props.submitUrl);
        var data = Object.assign({},this.state);
        delete data['children']
        delete data['form_state']

        var failed = false;
        var required = '';

        var defaults = {}
        for (var index in this.state.children) {
            var child = this.state.children[index];
            var prop = child.props;
            if (prop.required == true) {
              if (this.state[prop.name] == '') {
                required += "The field " + prop.label + " must be filled out to submit the form. ";
                failed = true
              }
            }
        }


        if (failed == true) {
          this.setState({required: required})
        }
        else {
          for (var item in data) {
              if (item.endsWith('[]')) {
                  console.log("STRINGIFY")
                  data[item] = JSON.stringify(data[item]);
                  console.log(item,data[item])
              }
          }

          if (this.props.submit) {
            this.props.submit(data)
          }
          else {
            if (this.props.submitUrl) {
              var submitUrl = resolveVariables({'submitUrl':this.props.submitUrl}, window.cmState.getGlobalState())['submitUrl'];
              ajaxWrapper("POST", submitUrl, data, this.formSubmitCallback);
            }
          }
        }
    }

    refreshDataCallback(value) {
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
                    var tempValue = resolveVariables(this.props.dataMapping, value[index]);
                    newValue['photos[]'].push(tempValue['photos[]']);
                }
            }
            else {
                newValue = resolveVariables(this.props.dataMapping, value);
            }
        }


        this.setState(newValue)

    }

    formSubmitCallback (value) {
        console.log("Form Submit Value",value);

        if (typeof(value[0]) != 'undefined'){
            if (this.props.setGlobalState) {
                if (this.props.globalStateName) {
                  var returnObj = value[0][this.props.objectName];
                  console.log("Return Obj", value[0], this.props.objectName, returnObj)
                    this.setState(value[0][this.props.objectName], () => this.props.setGlobalState(this.props.globalStateName,value[0][this.props.objectName]));
                } else {
                    this.setState(value[0][this.props.objectName], this.props.setGlobalState('Form',this.state));
                }
            }
            else if (value['success'] == true) {
              //do nothing
            }
            else {
              if (value[0]) {
                this.setState(value[0][this.props.objectName]);
              }

            }
        }

        if (this.props.deleteRedirectUrl && value['success'] == true) {
          window.location.href = this.props.deleteRedirectUrl;
        }
        else if (this.props.redirectUrl) {
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
        else if (this.props.functions) {
          run_functions(this.props.functions, this.setState, this.props.setGlobalState)
        }
    }

    formDelete() {
        ajaxWrapper("POST",this.props.deleteUrl, {}, this.formSubmitCallback.bind(this));
    }

    handleKeyPress = (event) => {
      if (this.props.submit_on_enter != false) {
        if(event.key == 'Enter') {
          console.log("Im submitting!!!")
          this.formSubmit()
        }
      }
    }

    render() {
        var layout = "";
        if (typeof(this.props.layout) != 'undefined') {
            layout = this.props.layout
        }


        if (this.props.row == true || this.props.row == "true") {
            layout +=" form-row row";
        }
        else {
            layout += " form";
        }


        let components = [];


        for (var index in this.state.children) {
            var child = this.state.children[index];

            if (child.props) {
                var newProps = {value: this.state[child.props.name], setFormState:this.setFormState, handleChange:this.handleChange, handleKeyPress: this.handleKeyPress}
                if (index == 0 && this.props.autoFocus) {
                  newProps['autoFocus'] = true;
                }

                components.push(React.cloneElement(child,newProps))
            }
        }


        var buttons = [];
        if (this.props.submitUrl || this.props.submit) {
            var classes = "btn btn-primary";
            if (this.props.submitButtonType) {
              classes = "btn btn-" + this.props.submitButtonType;
            }
            var float = {'float':'left'}
            var submitButton = <button css={float} className={classes} onClick={this.formSubmit}>Save</button>
            buttons.push(submitButton);
        }

        if (this.props.deleteUrl) {
            var float = {'float':'right'}
            var deleteButton = <Button css={float} type={"danger"} onClick={this.formDelete} deleteType={true} text={"Delete"} />
            buttons.push(deleteButton);
        }

        var failed = <div></div>;
        if (this.state.required != '') {
          failed = <Alert type={"danger"} text={this.state.required} />
        }

        //need to add in formsubmit, delete, and handle change functions to components.
        return(
            <div className={layout}  style={this.props.css} onKeyPress={this.handleKeyPress}>
                {components}
                {failed}
                {buttons}
            </div>
        )
    }
}

export default FormWithChildren;
