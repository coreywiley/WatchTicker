import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from "base/ajax.js";

import {
    Card, Container, Button, Image, Form, Select,
    TextInput, Navbar, List, Link, Accordion, Sidebar,
    Paragraph, RadioButton, TextArea, Header, TextAutocomplete
} from 'library';

import AdminTagSidebar from 'pages/adminTagSidebar.js';
import AdminSidebar from 'pages/adminSidebar.js';


class CodeViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            pageMeta: {},
            page: 0, offset: 5, step: 5,
            pages: {}, tags: [],
            loadingPages: false, up: false,
            selectedTags: [], searchString: "", searchResults: [],
            resultList: null,
            selected: false,
            open: false
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });

        this.getAllPages();
        this.getPages(this.state.page, this.state.offset);
        this.getTags();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    setGlobalState() {

    }

    getAllPages(page, offset) {
      ajaxWrapper("GET",  "/api/home/page/", {}, this.loadPageMeta.bind(this));
    }
    loadPageMeta(result){
        var pageMeta = this.state.pageMeta;
        for (var i=0; i<result.length; i++){
            pageMeta[result[i]['page']['id']] = result[i].page;
        }

        this.setState({
            pageMeta: pageMeta
        });
    }

    jumpToPage(e) {
        var id = e.currentTarget.getAttribute('num');
        var num = this.state.pageMeta[id].number;
        this.setState({
            pages: {},
            page: num,
            offset: num + 5
        }, () => {
            this.getPages(num, num + 5);
        });
    }

    getPages(page, offset) {
      ajaxWrapper("GET",  "/api/home/page/?related=text&number__gte="+ page +"&number__lt="+ offset, {}, this.loadPages.bind(this));
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
            up: false
        });
    }


    getTags(page, offset) {
      ajaxWrapper("GET",  "/api/home/tag/?related=synonyms", {}, this.loadTags.bind(this));
    }

    loadTags(result) {
        var tags = {};
        for (var i in result){
            var tag = result[i].tag;
            tags[tag.id] = tag;
        }

        this.setState({tags: tags});
    }

    createTagNameDict(){
        var tagNames = {};
        for (var key in this.state.tags){
            var tag = this.state.tags[key];

            tagNames[tag.name] = tag.id;
            for (var j=0; j<tag.synonyms.length; j++){
                tagNames[tag.synonyms[j].synonym.name + " ("+ tag.name +")"] = tag.id;
            }
        }

        return tagNames;
    }

    updateSearch(e) {
        this.setState({
            searchString: e.target.value
        });
    }

    addTag(e) {
        var done = false;
        var tags = this.state.selectedTags;
        var tagId = e.currentTarget.getAttribute('num');
        var tagText = e.currentTarget.innerText;
        var tag = this.state.tags[tagId];

        if (tagText != tag.name){
            tag.synonymSelected = tagText;
        }
        tags.push(tag);

        this.setState({
            selectedTags: tags,
            searchString: ""
        });
    }

    removeTag(e){
        var newTags = [];
        var tagId = e.currentTarget.getAttribute('num');

        for (var i=0; i<this.state.selectedTags.length; i++){
            var newTag = this.state.selectedTags[i];
            if (tagId != newTag.id){
                newTags.push(newTag);
            }
        }

        this.setState({
            selectedTags: newTags
        });
    }

    searchCode(){
        var url = "/api/home/chapter/?order_by=id&related=text,tags&";
        var tags = this.state.selectedTags;

        var tagNames = "";
        if (this.state.searchString != ""){tagNames += this.state.searchString + ","};
        for (var i=0; i<tags.length; i++){
            tagNames += tags[i].name + ",";
        }

        if (tagNames.length > 0){
            //tagNames = tagNames.slice(0, -1);
            url += "or__tags__name__in="+ tagNames +"&";
            url += "or__tags__synonyms__name__in="+ tagNames +"&";
            url += "or__text__text__icontains__splitme="+ tagNames +"&";
        }
        ajaxWrapper("GET",  url, {}, this.loadSearch.bind(this));
    }

    loadSearch(result){
        var searchResults = this.parseResults(result);
        this.setState({searchResults: searchResults});
    }

    parseResults(resultData) {
        var results = [];
        var resultList = null;
        for (var i in resultData){
            var chapter = resultData[i].chapter;
            var result = {page: chapter.startPage_id, texts: [], tags: []};

            if (this.state.searchString !== ""){
                this.matchAndHighlight(chapter, result, this.state.searchString);
            }

            for (var j in this.state.selectedTags){
                var tag = this.state.selectedTags[j];
                this.matchAndHighlight(chapter, result, tag.name);

                for (var k in chapter.tags){
                    var chapterTag = chapter.tags[k].tag;
                    if (chapterTag.name == tag.name) {
                        result.tags.push(tag.name);
                    }
                }
            }

            if (result.tags.length > 0) {
                var tagText = [];"Matched Tags: ";
                for (var j in result.tags){
                    tagText.push(<Button text={result.tags[j]} />);
                }
                result.texts.unshift(<div style={{padding:"10px 0px"}}>
                    {"Matched Tags: "}
                    {tagText}
                </div>);
            }

            if (result.tags.length > 0 || result.texts.length > 0){
                result.texts.push(<Button type="primary" text="Jump to page" num={result.page} clickHandler={this.jumpToPage.bind(this)} />);
                var resultJSX = <Card name={chapter.name}  description={result.texts} />;
                results.push(resultJSX);
            }

        }
        if (results.length > 0){
            resultList =
            <div>
                <br/>
                <h5>Results</h5>
                {results}
            </div>;
        }

        return resultList
    }

    matchAndHighlight(chapter, result, name) {
        var index = chapter.text.text.toLowerCase().indexOf(name.toLowerCase());
        if (index > -1){
            var text = chapter.text.text.slice(index-10, index+200);
            var text = <div>
                <span>{text.slice(0,10)}</span>
                <span style={{background:"yellow"}}>{text.slice(10, 10 + name.length)}</span>
                <span>{text.slice(10 + name.length, text.length)}</span>
            </div>
            result.texts.push(
                <div>{text}</div>
            );
        }
    }

    selected(e) {
        this.setState({selected: true});
    }

    handleScroll(event) {
        // do something like call `this.setState`
        // access window.scrollY etc
        if (window.scrollY < 1000 && this.state.page > 0 && !this.state.loadingPages){
            /*
            var offset = this.state.page;
            var page = this.state.page - this.state.step;
            this.getPages(page, offset);
            this.setState({
                page: page,
                loadingPages: true,
                up: true
            });
            */
        } else if (window.scrollY > document.body.scrollHeight - 2000 && !this.state.loadingPages){
            var page = this.state.offset;
            var offset = this.state.offset + this.state.step;
            this.getPages(page, offset);
            this.setState({
                offset: offset,
                loadingPages: true
            });
        }
    }

    toggleOpen(open){
        if (open){
            this.setState({
                open: true
            });
        } else {
            this.setState({
                open: false
            });
        }
    }

    render() {
        var openStyle = {};
        if (this.state.open){
            openStyle['width'] = "50%";
        }

        var pages = [];
        for (var key=0; key<this.state.offset; key++){
            if (key in this.state.pages){
                var page = this.state.pages[key];
                pages.push(<div key={page.id} dangerouslySetInnerHTML={{__html: page.text.text}} />);
            }
        }

        var tagNames = this.createTagNameDict();

        var adminTools = null;
        if (this.props.user && this.props.user.is_staff){
            adminTools =
            <div>
                <AdminSidebar
                    tags={this.state.tags}
                    tagNames={tagNames}
                    jumpToPage={this.jumpToPage.bind(this)}
                    toggleOpen={this.toggleOpen.bind(this)}
                />

                <AdminTagSidebar />
            </div>;
        }

        var content = <SelectionScreen
            selected={this.selected.bind(this)}
            toggleOpen={this.toggleOpen.bind(this)}
        />;

        if (this.state.selected){
            content =
            <div style={openStyle}>
                <div>
                    {pages}
                </div>

                <SearchSidebar
                    tags={this.state.tags}
                    tagNames={tagNames}
                    selectedTags={this.state.selectedTags}
                    searchString={this.state.searchString}
                    updateSearch={this.updateSearch.bind(this)}
                    addTag={this.addTag.bind(this)}
                    removeTag={this.removeTag.bind(this)}
                    searchCode={this.searchCode.bind(this)}
                    results={this.state.searchResults}
                    toggleOpen={this.toggleOpen.bind(this)}
                />

                <TableOfContents
                    toggleOpen={this.toggleOpen.bind(this)}
                    clickHandler={this.jumpToPage.bind(this)}
                />

                {adminTools}
            </div>;
        }

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}


class SelectionScreen extends Component {
    render() {
        var style = {
            margin: "15px",
            padding: "30px 15px",
            border: "thin solid #bbb",
            borderRadius: "3px"
        };
        var margin = {
            marginBottom: "20px"
        }

        return (
        <div className='row container' style={{margin:"0px auto"}} >
            <div className='col-6' style={margin} ><div style={style} >
                <h1>EE Code</h1>
                <Button type="info" clickHandler={this.props.selected} text="Search" />
            </div></div>

            <div className='col-6' style={margin} ><div style={style} >
                <h1>New York EE Code</h1>
                <h3>Coming Soon</h3>
            </div></div>
            <div className='col-6' style={margin} ><div style={style} >
                <h1>New Jersey EE Code</h1>
                <h3>Coming Soon</h3>
            </div></div>
            <div className='col-6' style={margin} ><div style={style} >
                <h1>Pennsylvania EE Code</h1>
                <h3>Coming Soon</h3>
            </div></div>
        </div>
        );
    }
}


class SearchSidebar extends Component {
    preventDefault(e) {
        e.preventDefault();
        return false;
    }

    render() {
        var tags = [];
        var selectedTags = null;
        for (var i=0; i<this.props.selectedTags.length; i++){
            var tag = this.props.selectedTags[i];
            var text = tag.name;
            if (tag.synonymSelected){
                var text = tag.synonymSelected;
            }
            tags.push(<Button type="info" text={text} num={tag.id} clickHandler={this.props.removeTag} />);
        }
        if (tags.length > 0){
            selectedTags =
            <div>
                <h5>Selected Tags</h5>
                <div>
                    {tags}
                </div>
                <br/>
            </div>;
        }

        var content =
        <div>
            <h3>Search</h3>
            <form autoComplete="new-password" onSubmit={this.preventDefault.bind(this)}>
                <TextAutocomplete label="Search one or more items"
                    options={this.props.tagNames} name="search"
                    value={this.props.searchString}
                    handlechange={this.props.updateSearch}
                    autocompleteSelect={this.props.addTag}
                    placeholder="Air Conditioning"
                />
                <br/>
            </form>

            {selectedTags}

            <div>
                <Button type="success" clickHandler={this.props.searchCode} text="Search" />
            </div>

            {this.props.results}
        </div>;

        return (
            <Sidebar content={content}
                openerText="Search" openerPosition="10px"
                widthPercent={50} headerHeight={67}
                toggleOpen={this.props.toggleOpen}
            />
        );
    }
}


class TableOfContents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: []
        };
    }


    componentDidMount(){
        var url = "/api/home/article/?related=chapters&order_by=id";
        ajaxWrapper("GET",  url, {}, this.loadArticles.bind(this));
    }

    loadArticles(result) {
        var articles = [];
        for (var i in result){
            var article = result[i].article;
            var chapters = [];
            for (var j in article.chapters){
                var chapter = article.chapters[j].chapter;
                chapters.push(chapter);
            }

            article.chapters = chapters;
            articles.push(article);
        }

        this.setState({
            articles: articles
        });
    }

    render() {

        var articles = [];
        for (var i in this.state.articles){
            var article = this.state.articles[i];

            var chapters = [];
            for (var j in article.chapters){
                var chapter = article.chapters[j];
                var chapterJSX = <div>
                    <a onClick={this.props.clickHandler} num={chapter.startPage_id}>{chapter.name}</a>
                </div>;

                chapters.push(chapterJSX);
            }

            var article = <div style={{margin:'0px 0px 20px 0px'}}>
                <a onClick={this.props.clickHandler} num={article.startPage_id}>
                    <h5>{article.name}</h5>
                </a>

                <div style={{padding:"0px 0px 0px 15px"}}>
                    {chapters}
                </div>
            </div>;

            articles.push(article);
        }

        var content =
        <div>
            <h3>Table of Contents</h3>

            <div style={{padding:"0px 0px 0px 15px"}}>{articles}</div>
        </div>;


        return (
            <Sidebar content={content}
                openerText="Table of Contents" openerPosition="85px"
                widthPercent={50} headerHeight={67}
                toggleOpen={this.props.toggleOpen}
            />
        );
    }
}





export default CodeViewer;
