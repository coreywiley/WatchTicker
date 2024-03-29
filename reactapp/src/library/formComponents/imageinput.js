import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import Image from '../displayComponents/image.js';
import {ajaxWrapper, ajaxWrapperFile} from 'functions';

import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {Card, Button} from 'library';




const SortableItem = SortableElement(({value, removeImage}) =>
  <Card css={{'display':'inline-block','width':'20%'}} imageUrl={value['url']} id={value['id']} buttons={[<Button text={'Remove Picture'} button_type={'danger'} clickHandler={() => removeImage({'id':value['id'], 'url':value['url']})} />]} />
);

const SortableList = SortableContainer(({items, removeImage}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} removeImage={removeImage} />
      ))}
    </ul>
  );
});

class ImageInput extends Component {

        constructor(props) {
        super(props);
        this.state ={
          files:null,
          uploaded_files:[],
        }

        this.onChange = this.onChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
        this.fileUploadCallback = this.fileUploadCallback.bind(this);
        this.removeImage = this.removeImage.bind(this);
      }

      onChange(e) {
        this.setState({files:e.target.files, uploaded_files:this.props.value}, this.fileUpload(e.target.files))
      }

      fileUpload(files) {
        var url = '/api/photoUpload/';
        const formData = new FormData();
        for (var index in files) {
            if (index != 'length' && index != 'item') {
                formData.append('files[]',files[index])
            }
        }
        formData.append('name', this.props.name)
        ajaxWrapperFile("POST", url, formData, this.fileUploadCallback);

      }



      removeImage(imageProps) {
        console.log("Remove Image")

        if (this.props.multiple == true) {
         var url = imageProps['url'];
         console.log("Url",url)
         var uploaded_files = this.props.value;
          var order_files = []
          for (var index in uploaded_files) {
                var file = uploaded_files[index];
                if (file.url != url) {
                    order_files.push({'url':file['url'],'order':index,'filename':file['filename']})
                }
          }

          if (this.props.deleteUrl) {
            console.log("Delete Posted", this.props.deleteUrl, imageProps)
            var deleteUrl = resolveVariables({'deleteUrl':this.props.deleteUrl}, imageProps)['deleteUrl'];
            ajaxWrapper("POST",deleteUrl, {}, console.log);
            console.log("Delete Posted")
          }
         var formState = {}
         console.log("Order Files", order_files)
         formState[this.props.name] = order_files



        this.props.setFormState(formState);
        }
        else {
            var formState = {}
         formState[this.props.name] = ''



        this.props.setFormState(formState);
        }

      }


      fileUploadCallback(value) {
          console.log("FileUploadCallback", value)
          var uploaded_files = this.props.value;

          if (this.props.multiple == true) {
              if (uploaded_files == undefined) {
                uploaded_files = [];
              }
              for (var index in value['uploaded_files']) {
                  uploaded_files.push(value['uploaded_files'][index]);
              }

              uploaded_files.sort(function(a, b) {
                return parseInt(a.order) - parseInt(b.order);
            })
        }
        else {
            console.log("Single File Upload")
            if (uploaded_files == undefined) {
                uploaded_files = '';
              }

              uploaded_files = value['uploaded_files'][0]['url'];
            console.log(uploaded_files);
        }

        var formFiles = {};

        formFiles[this.props.name] = uploaded_files
        console.log("Form Files",formFiles);

        this.setState({uploaded_files: uploaded_files}, this.props.setFormState(formFiles))

      }

      onSortEnd = ({oldIndex, newIndex}) => {
           if (this.props.multiple == true) {
              var uploaded_files = arrayMove(this.props.value, oldIndex, newIndex);
              var order_files = []
              for (var index in uploaded_files) {
                    var file = uploaded_files[index];
                    if (file.order != index) {
                        file.order = index;
                    }
                    order_files.push({'url':file['url'],'order':index,'filename':file['filename']})
              }
            var formState = {}
             formState[this.props.name] = order_files


            this.props.setFormState(formState);
        }
      };


    render() {

        if (this.props.multiple == true) {
            var input = <input onChange={this.onChange} type="file" className="form-control-file" id="exampleFormControlFile1" name={this.props.name} multiple />
        } else {
            var input = <input onChange={this.onChange} type="file" className="form-control-file" id="exampleFormControlFile1" name={this.props.name} />
        }

        var previewText = "Preview Your Photo Below";
        if (this.props.multiple == true) {
            previewText = "Re-order your photos below";
        }

        var pictureViewer = <div></div>;
        if (this.props.value.length > 0) {
            var value;
            if (this.props.multiple == true) {
                value = this.props.value;
            }
            else {
                value = [{'filename':'','url':this.props.value,'order':0}]
            }

            pictureViewer = <div className="jumbotron">
                <h4>{previewText}</h4>
                <SortableList axis={'x'} items={value} onSortEnd={this.onSortEnd} removeImage={this.removeImage} />;
            </div>;
        }

        return (

           <div className="form-group">
            <label htmlFor="exampleFormControlFile1">{this.props.label}</label>
            {input}
            {pictureViewer}
          </div>

        )
    }
}

export default ImageInput;
