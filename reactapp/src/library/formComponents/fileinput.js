import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';
import Image from '../displayComponents/image.js';
import ajaxWrapperFile from 'base/ajaxFile.js';
import ajaxWrapper from "base/ajax.js";

import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import Card from '../displayComponents/card.js';

class FileInput extends Component {

      constructor(props) {
        super(props);
        this.state = {
          files:null,
          uploaded_files:[],
        }

        this.onChange = this.onChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.fileUploadCallback = this.fileUploadCallback.bind(this);
      }

      onChange(e) {
        var files = e.target.files;
        var newState = {}
        newState[this.props.name] = files;
        console.log("Files",files);
        this.setState({files:files})
      }

      fileUpload() {
        var url = this.props.submitUrl;
        console.log("Url",url);
        const formData = new FormData();
        for (var index in this.state.files) {
            if (index != 'length' && index != 'item') {
                formData.append('csv_file',this.state.files[index])
            }
        }
        formData.append('name', this.props.name)
        ajaxWrapperFile("POST", url, formData, this.fileUploadCallback);
      }

      fileUploadCallback(value) {
        console.log("Here",this.props.redirectUrl)
        if (this.props.redirectUrl) {
          window.location.href = this.props.redirectUrl;
        }
      }

    render() {

        if (this.props.multiple == true) {
            var input = <input onChange={this.onChange} type="file" className="form-control-file" id="exampleFormControlFile1" name={this.props.name} multiple />
        } else {
            var input = <input onChange={this.onChange} type="file" className="form-control-file" id="exampleFormControlFile1" name={this.props.name} />
        }


        return (

           <div className="form-group">
            <label htmlFor="exampleFormControlFile1">{this.props.label}</label>
            {input}
            <button className="btn btn-primary" onClick={this.fileUpload}>Save</button>
          </div>

        )
    }
}

export default FileInput;
