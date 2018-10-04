import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from "base/ajax.js";

import {
    Card, Container, Button, Image, Form, Select,
    TextInput, Navbar, List, Link, Accordion, Sidebar,
    Paragraph, RadioButton, TextArea, Header, TextAutocomplete
} from 'library';


class AdminTagSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            tag: null,
            tagName: "",
            open: false,
            height: "0px",
            synonymName: ""
        };
    }

    componentDidMount() {
        var height = String(window.outerHeight - 67) + "px";
        var width = String(window.outerWidth * .5) + "px";
        this.setState({
            height: height,
            width: width
        });

        this.getTags();
    }

    toggle() {
        if (this.state.open){
            this.setState({ open: false});
        } else {
            this.setState({ open: true});
        }
    }

    getTags() {
      ajaxWrapper("GET",  "/api/home/tag/?related=synonyms", {}, this.loadTags.bind(this));
    }
    loadTags(result) {
        var tags = {};
        for (var key in result){
            tags[result[key].tag.id] = result[key].tag;
        }
        this.setState({
            tags: tags
        });
    }

    updateTag(e) {
        this.setState({
            tagName: e.target.value
        });
    }
    updateSynonym(e) {
        this.setState({
            synonymName: e.target.value
        });
    }

    chooseTag(e) {
        var tag = this.state.tags[e['tag']];

        this.setState({
            tag: tag
        });
    }

    createTag() {
        var data = {
            name: this.state.tagName
        }
        ajaxWrapper("POST",  "/api/home/tag/?related=synonyms", data, this.refreshTagCallback.bind(this));
    }

    addSynonym(e) {
        var id = this.state.tag.id;
        var synonym = this.state.synonymName;

        var data = {
            name: synonym,
            tag: id
        };
        ajaxWrapper("POST",  "/api/home/synonym/", data, this.refreshTag.bind(this));
    }

    removeSynonym(e) {
        var id = this.state.tag.id;
        var synonymId = e.currentTarget.getAttribute('num');

        ajaxWrapper("GET",  "/api/home/synonym/" + synonymId + '/delete/', {}, this.refreshTag.bind(this));
    }

    refreshTag(result) {
        ajaxWrapper("GET",  "/api/home/tag/" + this.state.tag.id + '/?related=synonyms', {}, this.refreshTagCallback.bind(this));
    }
    refreshTagCallback(result) {
        var tags = this.state.tags;
        tags[result[0].tag.id] = result[0].tag;
        this.setState({
            tags: tags,
            tag: result[0].tag,
            synonymName: ""
        });
    }

    render() {
        var options = [];
        var select = null;
        for (var key in this.state.tags){
            var tag = this.state.tags[key];
            options.push({'text': tag.name, 'value': tag.id});
        }
        if (options.length > 0){
            if (this.state.tag){ var value = {value: this.state.tag.id};}
            select = <Select {...value} label="Choose Tag to Edit" name='tag' options={options} setFormState={this.chooseTag.bind(this)} />;
        }

        var synonyms = [];
        if (this.state.tag){
            for (var i in this.state.tag.synonyms){
                var synonym = this.state.tag.synonyms[i].synonym;
                var text = synonym.name;
                synonyms.push(<Button type="info" text={text} num={synonym.id} clickHandler={this.removeSynonym.bind(this)} />);
            }
        }

        var content =
        <div>
            <h3>Admin: Tags</h3>

            <div>
                {select}
                <br/>
            </div>

            <div>
                <TextInput label="Type tag to add" value={this.state.tagName} handlechange={this.updateTag.bind(this)} />
                <Button text="Add" clickHandler={this.createTag.bind(this)} />
            </div>

            <div>
                <br/>
                <TextInput label="Type synonym to add" value={this.state.synonymName} handlechange={this.updateSynonym.bind(this)} />
                <Button text="Add" clickHandler={this.addSynonym.bind(this)} />
            </div>

            <div>
                <br/>
                <div>Current Synonyms: (click to remove)</div>
                {synonyms}
            </div>
        </div>;

        return (
            <Sidebar content={content} widthPercent={50} headerHeight={67}
                openerText="Admin: Tags & Synonyms" openerPosition="240px"
                toggleOpen={this.props.toggleOpen}
            />
        );
    }
}


export default AdminTagSidebar;
