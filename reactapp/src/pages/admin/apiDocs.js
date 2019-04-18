import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import {Wrapper, Header} from 'library';
import APIQuery from './apiQuery.js';

let ComponentDict = {
    'AutoField': "TextInput",
    'CharField': "TextInput",
    'ForeignKey': "Select",
    'IntegerField': "TextInput",
    'TextField': "TextArea",
    'DecimalField':'NumberInput',
    'BooleanField':'BooleanInput',
    'ManyToManyField':'Select',
    'DateTimeField': 'TextInput',
};

class APIDocs extends Component {

    constructor(props) {
        super(props);
        this.state = {models: [], loaded: false};

        this.modelsCallback = this.modelsCallback.bind(this);

    }

    componentDidMount() {
      ajaxWrapper('GET','/api/getModels/home/', {}, this.modelsCallback)
    }

    modelsCallback(result) {
      var models = [];
      for (var index in result) {
        models.push(result[index]['model']['name'])
      }

      this.setState({models:models, loaded:true})
    }


    render() {

        var modelDocs = []
        var links = [];
        modelDocs.push(<div id='User'><Header text={'User'} size={2} /><APIQuery app={"user"} model={"User"}/></div>)
        links.push(<a href='#User'>User</a>)
        links.push(<br/>)
        for (var index in this.state.models) {
            var model_name = this.state.models[index]
            modelDocs.push(<div id={model_name}><Header text={model_name} size={2} /><APIQuery app={"home"} model={model_name}/></div>)
            links.push(<a href={'#' + model_name}>{model_name}</a>)
            links.push(<br/>)
        }

        var content =
        <div style={{'marginTop':'150px'}}>

          <div id='sidebar' style={{'position':'fixed', 'left':'0px'}}>
            <div className="col-md-2">
              <Header text={'Models'} />
              {links}
            </div>
          </div>

          <div className="row">
            <div className="col-md-2">

            </div>
            <div className='col-md-10'>
              <Header text={'API Docs'} />
              {modelDocs}
            </div>
          </div>
        </div>

        return (
            <div className="container">
                <Wrapper loaded={this.state.loaded} content={content} />
            </div>
             );
    }
}
export default APIDocs;
