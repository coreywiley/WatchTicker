import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from "base/ajax.js";

import {
    Button, Image, Paragraph, Form, Select, NumberInput,
    TextInput, ButtonGroup, TextArea, CheckGroup, Header
} from 'library';

class FormPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {},
            submission: {},
            loaded: true,
            title: ''
        };
    }

    componentDidMount() {
        if (this.props.id == 0){
            var url = "/api/home/projectform/?related=elements";
            var data = {
                project: this.props.project
            };

            ajaxWrapper("POST",  url, data, this.loadForm.bind(this));

        } else {
            this.getForm();

            if (!(this.props.edit)){
                if (this.props.submissionId == 0){
                    var url = "/api/home/formsubmission/";
                    var data = {
                        form: this.props.id
                    };

                    ajaxWrapper("POST",  url, data, this.loadSubmission.bind(this));

                } else {
                    this.getSubmission();
                }
            }
        }
    }

    getForm() {
        var url = "/api/home/projectform/" + this.props.id + "/?related=elements,project,project__company,submissions";
        ajaxWrapper("GET",  url, {}, this.loadForm.bind(this));
    }

    loadForm(result){
        if (this.props.id != result[0]['projectform']['id']) {
            var id = result[0]['projectform']['id'];
            window.location = '/' + this.props.params[0] + '/' + this.props.project + '/' + this.props.params[2] + '/' + id + '/';
        }

        var form = result[0]['projectform'];
        for (var i in form['elements']) {
            if (form['elements'][i]['formelement']['data'] == ""){
                form['elements'][i]['formelement']['data'] = {}
            }
        }

        this.setState({
            form: form,
            title: form['title']
        });
    }

    getSubmission() {
        var url = "/api/home/formsubmission/" + this.props.submissionId + "/";
        ajaxWrapper("GET",  url, {}, this.loadSubmission.bind(this));
    }
    loadSubmission(result){
        var submission = result[0]['formsubmission'];
        if (this.props.submissionId != submission['id']) {
            var newUrl = '/' + this.props.params[0] + '/' + this.props.project + '/'
            newUrl += this.props.params[2] + '/' + this.props.id + '/';
            newUrl += this.props.params[4] + '/' + submission['id'] + '/';

            window.location = newUrl;
        }

        this.setState({
            submission: submission
        });
    }

    addElement(){
        var url = "/api/home/formelement/";
        var data = {
            form: this.props.id
        };

        ajaxWrapper("POST",  url, data, this.loadElement.bind(this));
    }
    loadElement(result){
        var form = this.state.form;
        form['elements'].push(result[0]['formelement']);

        this.setState({
            form: form
        });
    }
    updateElement(result){
        var form = this.state.form;
        var element = result[0]['formelement'];
        if (element['data'] == ""){
            element['data'] = {}
        }

        for (var i in form['elements']){
            if (form['elements'][i]['formelement']['id'] == element['id']){
                form['elements'][i]['formelement'] = element;
            }
        }

        form['elements'].sort(dynamicSort('formelement.order'));

        this.setState({
            form: form
        });
    }

    updateTitle(e){
        this.setState({
            title: e.currentTarget.value
        });
    }
    changeTitle(e){
        var url = "/api/home/projectform/" + this.props.id + "/?related=elements,project,project__company";
        var data = {
            title: e.currentTarget.value
        };

        ajaxWrapper("POST",  url, data, this.loadForm.bind(this));
    }

    render() {
        var editTitle = null;
        var form = [];
        var elements = [];
        var newForm = null;
        if (this.props.edit){
            newForm = <div>
              <Header size={2} text={'Create The Form For Your Project'} />
              <Button type={'success'} text={'Finish Form'} href={'/inviteCollaborators/' + this.props.project + '/'} />
              </div>

            editTitle = <div>
                <TextInput name='title' value={this.state.title}
                    handlechange={this.updateTitle.bind(this)} onBlur={this.changeTitle.bind(this)} />
                <br/>
                <h4>Questions</h4>
            </div>

            for (var i in this.state.form.elements) {
                var data = this.state.form.elements[i]['formelement'];

                elements.push(
                    <FormElement key={data['id']} data={data} updateElement={this.updateElement.bind(this)} />
                );
            }

            form.push(<div className='col-6'>{elements}</div>);
            form.push(<div className='col-6'><RenderedForm data={this.state.form} edit={this.props.edit} /></div>);
            form.push(<Button type="primary" text="Add New Element" clickHandler={this.addElement.bind(this)} />);
        } else {
            form.push(<div className='col-12'>
                <RenderedForm data={this.state.form} submission={this.state.submission}
                    edit={this.props.edit} loadSubmission={this.loadSubmission.bind(this)} />
            </div>);
        }

        var content =
        <div className='container'>
            <br />
            {newForm}
            <br/><br/>
            <div style={{textAlign:"center"}} className='row'>
                <div className='col-12' style={{textAlign:'left'}}>
                    <h1>{this.state.form.title}</h1>
                    {editTitle}
                </div>

                {form}

                <br/>
            </div>
        </div>;

        return (
            <Wrapper token={this.props.user_id} loaded={this.state.loaded}  content={content} />
        );
    }
}




var ELEMENT_TYPES = {
    0: 'Radio',
    1: 'Checkbox',
    2: 'Text Input',
    3: 'Number Input',
    4: 'Paragraph Input',
    5: 'Text Only'
};

class RenderedForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            saved: false
        };
    }


    saveSubmission(formData){
        var searchTerm = formData['searchTerm'];
        if (searchTerm == ''){ searchTerm = 'New Submission';}
        delete formData['searchTerm'];

        var market = formData['market'];
        delete formData['market'];

        var url = "/api/home/formsubmission/" + this.props.submission['id'] + "/";
        var data = {
            searchTerm: searchTerm,
            market:market,
            data: JSON.stringify(formData)
        };

        ajaxWrapper("POST",  url, data, this.submissionSaved.bind(this));
    }
    submissionSaved(result){
        this.setState({
            saved: true
        });
        window.scrollTo(0,0);
        this.props.loadSubmission(result);
    }

    render() {
        var defaults = {};
        if (typeof(this.props.submission) != 'undefined' && 'data' in this.props.submission){
            defaults = this.props.submission['data'];
            defaults['searchTerm'] = this.props.submission['searchTerm'];
            defaults['market'] = this.props.submission['market_id'];
        }

        var Components = [];
        var ComponentsProps = [];

        if (!(this.props.edit)){
            Components.push(TextInput);
            ComponentsProps.push({
                name: 'searchTerm',
                label: "Submission Title",
                layout: "leftAlign spacing"
            });
            Components.push(Select);
            ComponentsProps.push({
              name: 'market',
              label: "Market",
              optionsUrl:'/api/home/market/',
              optionsUrlMap:{'text':['market','name'], 'value':['market','id']}
            })
        }

        for (var i in this.props.data['elements']){
            var element = this.props.data['elements'][i]['formelement'];

            var Component = null;
            var ComponentProps = {
                name: element['id'],
                label: element['pretext'],
                layout: "leftAlign spacing"
            };
            var type = ELEMENT_TYPES[element['type']];

            if (type == 'Radio') {
                Component = ButtonGroup;
                ComponentProps = Object.assign({
                    type: 'secondary',
                    options: element['data']['options']
                }, ComponentProps);

            } else if (type == 'Checkbox'){
                Component = CheckGroup;
                ComponentProps = Object.assign({
                    type: 'secondary',
                    options: element['data']['options']
                }, ComponentProps);
            } else if (type == 'Number Input'){
                Component = NumberInput;
            } else if (type == 'Text Input'){
                Component = TextInput;
            } else if (type == 'Paragraph Input'){
                Component = TextArea;
            } else if (type == 'Text Only'){
                Component = Paragraph;
            } else if (type == 'Image'){
                Component = Image;
            }

            Components.push(Component);
            ComponentsProps.push(ComponentProps);
        }

        var saved = null;
        if (this.state.saved){
            saved = <div className="alert alert-success">Submission Saved Succesfully!</div>;
        }

        return (
            <div>
                {saved}
                <Form components={Components} componentProps={ComponentsProps}
                        submitFunc={this.saveSubmission.bind(this)} defaults={defaults}
                        buttonClass={"leftAlign spacing"}
                     />
            </div>
        );
    }
}



class FormElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            component: null,
            props: null,
            text: "",
            optionText: ''
        };
    }

    componentDidMount(){
        this.setState({
            text: this.props.data['pretext'],
            order: this.props.data['order']
        })
    }

    changeType(e){
        var url = "/api/home/formelement/" + this.props.data['id'] + "/";
        var type = e['type'];
        var data = {
            type: type
        };

        ajaxWrapper("POST",  url, data, this.props.updateElement.bind(this));
    }

    updateText(e){
        this.setState({
            text: e.currentTarget.value
        });
    }
    changeText(e){
        var url = "/api/home/formelement/" + this.props.data['id'] + "/";
        var data = {
            pretext: e.currentTarget.value
        };

        ajaxWrapper("POST",  url, data, this.props.updateElement.bind(this));
    }

    updateOrder(e){
        this.setState({
            order: e.currentTarget.value
        });
    }
    changeOrder(e){
        var url = "/api/home/formelement/" + this.props.data['id'] + "/";
        var data = {
            order: e.currentTarget.value
        };

        ajaxWrapper("POST",  url, data, this.props.updateElement.bind(this));
    }

    addOption(e){
        var text = e.currentTarget.value.trim();

        if (e.key === 'Enter') {
            var jsonData = this.props.data['data'];
            if (!('options' in jsonData)){ jsonData['options'] = [];}

            jsonData['options'].push(text);

            var url = "/api/home/formelement/" + this.props.data['id'] + "/";
            jsonData = JSON.stringify(jsonData);
            var data = {
                data: jsonData
            };

          ajaxWrapper("POST",  url, data, this.props.updateElement.bind(this));
          this.setState({
              optionText: ''
          });

        } else {
            this.setState({
                optionText: text + e.key
            });
        }
    }
    removeOption(e){
        var jsonData = this.props.data['data'];
        var text = e.currentTarget.innerText;
        if (!('options' in jsonData)){ jsonData['options'] = [];}

        var index = jsonData['options'].indexOf(text);
        if (index > -1){
            jsonData['options'].splice(index, 1);
        }

        var url = "/api/home/formelement/" + this.props.data['id'] + "/";
        jsonData = JSON.stringify(jsonData);
        var data = {
            data: jsonData
        };

      ajaxWrapper("POST",  url, data, this.props.updateElement.bind(this));
    }

    render() {
        var options = [];
        for (var key in ELEMENT_TYPES){
            var type = ELEMENT_TYPES[key];
            options.push({'text': type, 'value': key});
        }

        var order = <TextInput label="Order" name='order' value={this.state.order}
            handlechange={this.updateOrder.bind(this)} onBlur={this.changeOrder.bind(this)} />;

        var select = <Select label="Type" name='type' options={options}
            value={String(this.props.data['type'])} setFormState={this.changeType.bind(this)} />;

        var textInput = <TextArea rows='4' label="Question Text" name='text' value={this.state.text}
            handlechange={this.updateText.bind(this)} onBlur={this.changeText.bind(this)} />;

        var options = null;
        if (this.props.data['type'] <= 1){
            var optionTags = [];
            for (var i in this.props.data['data']['options']){
                var text = this.props.data['data']['options'][i];
                optionTags.push(<Button type="secondary" key={text} text={text}
                    clickHandler={this.removeOption.bind(this)} inline={true} />);
            }

            options = <div className='col-12'><div className='row' style={{margin:"0px -15px"}}>
                <div className='col-6'>
                    <TextInput name='options' label="Hit enter to add new option" value={this.state.optionText} handleKeyPress={this.addOption.bind(this)} />
                </div>
                <div className='col-6'>
                    {optionTags}
                </div>
                <br/><br/>
            </div></div>;
        }

        var content =
        <div className='card' style={{padding:'10px'}}>
            <div className='row'>
                <div className="col-4">
                    {order}
                    {select}
                </div>
                <div className="col-8">
                    {textInput}
                </div>
                {options}
                <br/>
            </div>
        </div>;

        return (
            <div>
                {content}
                <br/>
            </div>
        );
    }
}



function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        if (property.indexOf('.') > -1){
            for (var i in property.split('.')){
                var key = property.split('.')[i];
                if (!(property.endsWith(key))){
                    a = a[key];
                    b = b[key];
                }
            }
        }
        var prop = property.split('.')[property.split('.').length - 1];
        var result = (a[prop] < b[prop]) ? -1 : (a[prop] > b[prop]) ? 1 : 0;
        return result * sortOrder;
    }
}



export default FormPage;
