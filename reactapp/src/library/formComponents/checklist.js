import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {Checkbox, ListWithChildren} from 'library';

class Checklist extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this)
      }

      handleChange = (e) => {
       var value = e.target.value;
       var checked = this.props.value;
       if (checked == undefined || checked == '') {
        checked = [];
       }

        //using this instead of indexOf because I was having trouble with "4" and 4.
       var found = -1;
       if (checked) {
           for (var index in checked) {
                if (checked[index] == value) {
                    found = index;
                    break;
                }
           }
       }
       var index = checked.indexOf(value);
        if (found > -1) {
            checked.splice(found, 1);
        }
        else {
            console.log("Checked",checked)
            checked.push(value)
        }
        var formCheck = {}
        formCheck[this.props.name] = checked;
        console.log("Checked",checked);
        this.props.setFormState(formCheck);
    }


    render() {
        if (this.props.dataMapping){
            this.props.dataMapping['onChange'] = this.handleChange;
            this.props.dataMapping['checkList'] = this.props.value;
        }

        return (
            <div className="form-group">
                <ListWithChildren {...this.props}>
                    <Checkbox />
                </ListWithChildren>
            </div>
        )
    }
}

export default Checklist;
