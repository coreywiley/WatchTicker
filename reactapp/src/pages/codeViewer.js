import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from "base/ajax.js";

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header} from 'library';

class CodeViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            page: 0, offset: 10, step: 10,
            pages: {},
            scroll: 0, loadingPages: false, up: false,
            tags: [], searchString: "", searchResults: []
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        this.getPages(this.state.page, this.state.offset);
        this.getTags();
        this.searchCode();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    setGlobalState() {

    }


    getPages(page, offset) {
      ajaxWrapper("GET",  "/api/home/page/?number__gte="+ page +"&number__lt="+ offset, {}, this.loadPages.bind(this));
    }

    loadPages(result) {
        var pages = this.state.pages;
        for (var i=0; i<result.length; i++){
            pages[result[i].page.number] = result[i].page;
        }

        if (this.state.up){
            window.scrollTo(0, window.scrollY + 1214 * this.state.step);
        }

        this.setState({
            pages: pages,
            loadingPages: false,
            up: true
        });
    }


    getTags(page, offset) {
      ajaxWrapper("GET",  "/api/home/tag/?related=synonyms", {}, this.loadTags.bind(this));
    }

    loadTags(result) {
        this.setState({tags: result});
    }


    searchCode(){
        var url = "/api/home/article/?";
        var tags = this.state.tags;
        var tagNames = "";
        if (this.state.searchString != ""){tagNames += this.state.searchString + ","};

        for (var i=0; i<tags.length; i++){
            tagNames += tags[i] + ",";
        }
        tagNames = tagNames.slice(0, -1);

        url += "or__tags__name__in="+ tagNames +"&";
        url += "or__tags__synonyms__name__in="+ tagNames +"&";
        url += "or__text__icontains__splitme="+ tagNames +"&";
        ajaxWrapper("GET",  url, {}, this.loadSearch.bind(this));
    }

    loadSearch(result){
        this.setState({searchResults: result});
    }

    handleScroll(event) {
        // do something like call `this.setState`
        // access window.scrollY etc
        if (window.scrollY < 1000 && this.state.page > 0 && !this.state.loadingPages){
            var offset = this.state.page;
            var page = this.state.page - this.state.step;
            this.getPages(page, offset);
            this.setState({
                page: page,
                loadingPages: true,
                up: true
            });
        } else if (window.scrollY > document.body.scrollHeight - 2000 && !this.state.loadingPages){
            var page = this.state.offset;
            var offset = this.state.offset + this.state.step;
            this.getPages(page, offset);
            this.setState({
                offset: offset,
                loadingPages: true
            });
        }

        this.setState({scroll: window.scrollY});
    }

    render() {
        var pages = [];
        for (var key=0; key<this.state.offset; key++){
            if (key in this.state.pages){
                var page = this.state.pages[key];
                pages.push(<div dangerouslySetInnerHTML={{__html: page.text}} />);
            }
        }

        var content =
        <div>
            {pages}
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}

export default CodeViewer;
