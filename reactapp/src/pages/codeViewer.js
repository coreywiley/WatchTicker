import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from "base/ajax.js";

import {
    Card, Container, Button, Image, Form, Select,
    TextInput, Navbar, List, Link, Accordion,
    Paragraph, RadioButton, TextArea, Header, TextAutocomplete
} from 'library';

class CodeViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            pageMeta: {},
            page: 0, offset: 5, step: 5,
            pages: {}, tags: [],
            scroll: 0, loadingPages: false, up: false,
            selectedTags: [], searchString: "", searchResults: []
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
        this.setState({tags: result});
    }

    updateSearch(e) {
        this.setState({
            searchString: e.target.value
        });
    }

    addTag(e) {
        var done = false;
        var tags = this.state.selectedTags;
        var tag = e.target.innerHTML;

        for (var i=0; i<this.state.tags.length; i++){
            var newTag = this.state.tags[i];
            if (tag == newTag.tag.name){
                tags.push(newTag);
                done = true;
            }
            for (var j=0; j<newTag.tag.synonyms.length; j++){
                if (tag == newTag.tag.synonyms[j].synonym.name){
                    newTag.tag.synonymSelected = tag;
                    tags.push(newTag);
                    done = true;
                    break;
                }
            }
            if (done){ break;}
        }

        this.setState({
            selectedTags: tags,
            searchString: ""
        });
    }
    removeTag(e){
        var newTags = [];
        var tag = e.target.innerText.split(':')[0];

        for (var i=0; i<this.state.selectedTags.length; i++){
            var newTag = this.state.selectedTags[i];
            if (tag != newTag.tag.name){
                newTags.push(newTag);
            }
        }

        this.setState({
            selectedTags: newTags
        });
    }

    searchCode(){
        var url = "/api/home/article/?order_by=id&related=text,tags&";
        var tags = this.state.selectedTags;

        var tagNames = "";
        if (this.state.searchString != ""){tagNames += this.state.searchString + ","};
        for (var i=0; i<tags.length; i++){
            tagNames += tags[i].tag.name + ",";
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
        this.setState({searchResults: result});
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

        this.setState({scroll: window.scrollY});
    }

    render() {
        var pages = [];
        for (var key=0; key<this.state.offset; key++){
            if (key in this.state.pages){
                var page = this.state.pages[key];
                pages.push(<div key={page.id} dangerouslySetInnerHTML={{__html: page.text.text}} />);
            }
        }

        var content =
        <div>
            <div>
                {pages}
            </div>

            <Sidebar tags={this.state.tags}
                selectedTags={this.state.selectedTags}
                searchString={this.state.searchString}
                updateSearch={this.updateSearch.bind(this)}
                addTag={this.addTag.bind(this)}
                removeTag={this.removeTag.bind(this)}
                searchResults={this.state.searchResults}
                searchCode={this.searchCode.bind(this)}
                jumpToPage={this.jumpToPage.bind(this)}
            />

            <AdminSidebar tags={this.state.tags}
                jumpToPage={this.jumpToPage.bind(this)}
            />
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}


class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            height: "0px"
        };
    }

    componentDidMount() {
        var height = String(window.outerHeight - 67) + "px";
        var width = String(window.outerWidth * .5) + "px";
        this.setState({
            height: height,
            width: width
        });
    }

    toggle() {
        if (this.state.open){
            this.setState({ open: false});
        } else {
            this.setState({ open: true});
        }
    }

    render() {
        var position = {
            position: "fixed",
            top: "67px",
            right: "0px",
            width: "50%",
            background: "white",
            boxShadow: 'rgba(0, 0, 0, 0.2) -2px 2px 5px'
        }
        var toggleText = "Close";
        if (!this.state.open){
            position['right'] = "-" + this.state.width;
            toggleText = "Open Search";
        }

        var openerStyle = {
            position: 'absolute',
            top: '10px',
            right: '920px',
            padding: '10px',
            background: 'white',
            borderTopLeftRadius: '10px',
            borderBottomLeftRadius: '10px',
            boxShadow: 'rgba(0, 0, 0, 0.3) -4px 2px 5px'
        }

        var opener =
        <div style={openerStyle}>
            <button className="btn btn-info" onClick={this.toggle.bind(this)}>{toggleText}</button>
        </div>

        var tagNames = [];
        for (var i=0; i<this.props.tags.length; i++){
            var tag = this.props.tags[i].tag;

            tagNames.push(tag.name);
            for (var j=0; j<tag.synonyms.length; j++){
                tagNames.push(tag.synonyms[j].synonym.name);
            }
        }

        var tags = [];
        var selectedTags = null;
        for (var i=0; i<this.props.selectedTags.length; i++){
            var tag = this.props.selectedTags[i].tag;
            var text = tag.name;
            if (tag.synonymSelected){
                var text =
                <div>
                    <b>{tag.name}</b>:<br/>
                    <span>{tag.synonymSelected}</span>
                </div>;
            }
            tags.push(<Button type="info" text={text} clickHandler={this.props.removeTag} />);
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

        var results = [];
        var resultList = null;
        for (var i=0; i<this.props.searchResults.length; i++){
            var article = this.props.searchResults[i].article;
            var result = {page: article.startPage_id, texts: [], tags: []};

            for (var j=0; j<this.props.selectedTags.length; j++){
                var tag = this.props.selectedTags[j].tag;
                var index = article.text.text.indexOf(tag.name);
                if (index > -1){
                    var text = article.text.text.slice(index-10, index+200);
                    var text = <div>
                        <span>{text.slice(0,10)}</span>
                        <span style={{background:"yellow"}}>{text.slice(10, 10 + tag.name.length)}</span>
                        <span>{text.slice(10 + tag.name.length, text.length)}</span>
                    </div>
                    result.texts.push(
                        <div>{text}</div>
                    );
                }

                for (var j=0; j<article.tags.length; j++){
                    var articleTag = article.tags[j].tag;
                    if (articleTag.name == tag.name) {
                        result.tags.push(tag.name);
                    }
                }
            }

            if (result.tags.length > 0) {
                var tagText = [];"Matched Tags: ";
                for (var j=0; j<result.tags.length; j++){
                    tagText.push(<Button text={result.tags[j]} />);
                }
                result.texts.unshift(<div style={{padding:"10px 0px"}}>
                    {"Matched Tags: "}
                    {tagText}
                </div>);
            }

            if (result.tags.length > 0 || result.texts.length > 0){
                result.texts.push(<Button type="primary" text="Jump to page" num={result.page} clickHandler={this.props.jumpToPage} />);
                var resultJSX = <Card name={article.name}  description={result.texts} />;
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


        return (
            <div style={position} >
                {opener}
                <div className="container" style={{height: this.state.height, overflow: "scroll"}}>
                    <br/>
                    <h3>Search</h3>

                    <div>
                        <div>Search one or more items</div>
                        <TextAutocomplete options={tagNames} name="search"
                            value={this.props.searchString}
                            handlechange={this.props.updateSearch}
                            autocompleteSelect={this.props.addTag}
                            placeholder="Air Conditioning"
                        />
                        <br/>
                    </div>

                    {selectedTags}

                    <div>
                        <Button type="success" clickHandler={this.props.searchCode} text="Search" />
                    </div>

                    {resultList}

                    <br/>
                </div>
            </div>
        );
    }
}

class AdminSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            article: null,
            open: false,
            height: "0px",
            searchString: ""
        };
    }

    componentDidMount() {
        var height = String(window.outerHeight - 67) + "px";
        var width = String(window.outerWidth * .5) + "px";
        this.setState({
            height: height,
            width: width
        });

        this.getArticles();
    }

    toggle() {
        if (this.state.open){
            this.setState({ open: false});
        } else {
            this.setState({ open: true});
        }
    }

    getArticles() {
      ajaxWrapper("GET",  "/api/home/article/?related=tags", {}, this.loadArticles.bind(this));
    }
    loadArticles(result) {
        this.setState({
            articles: result
        });
    }

    updateSearch(e) {
        this.setState({
            searchString: e.target.value
        });
    }

    chooseArticle(e) {
        var selected = null;
        for (var i in this.state.articles){
            var article= this.state.articles[i];
            if (article.article.name == e['article']){
                selected = article;
            }
        }
        this.setState({
            article: selected
        });
    }

    addArticleTag(e) {
        var id = this.state.article.article.id;
        var name = e.currentTarget.innerText;
        var tagIds = [];
        for (var i in this.props.tags){
            var tag = this.props.tags[i].tag;
            if (tag.name == name){
                tagIds.push(tag.id);
                break;
            }
        }

        var data = {
            "tags[]": JSON.stringify(tagIds)
        };
        ajaxWrapper("POST",  "/api/home/article/" + id + '/?related=tags&', data, this.addTagResponse.bind(this));
    }

    addTagResponse(result) {
        this.setState({
            searchString: "",
            article: result[0]
        });
    }

    removeArticleTag(e) {

    }

    render() {
        var position = {
            position: "fixed",
            top: "67px",
            right: "0px",
            width: "50%",
            background: "white",
            boxShadow: 'rgba(0, 0, 0, 0.2) -2px 2px 5px'
        }
        var toggleText = "Close";
        if (!this.state.open){
            position['right'] = "-" + this.state.width;
            toggleText = "Admin Article Tagging";
        }

        var openerStyle = {
            position: 'absolute',
            top: '100px',
            right: '920px',
            padding: '10px',
            background: 'white',
            borderTopLeftRadius: '10px',
            borderBottomLeftRadius: '10px',
            boxShadow: 'rgba(0, 0, 0, 0.3) -4px 2px 5px'
        }

        var opener =
        <div style={openerStyle}>
            <button className="btn btn-info" onClick={this.toggle.bind(this)}>{toggleText}</button>
        </div>

        var tagNames = [];
        for (var i=0; i<this.props.tags.length; i++){
            var tag = this.props.tags[i].tag;

            tagNames.push(tag.name);
            for (var j=0; j<tag.synonyms.length; j++){
                tagNames.push(tag.synonyms[j].synonym.name);
            }
        }

        var jumpToPage = null;
        var tags = [];
        if (this.state.article){
            jumpToPage = <Button type="primary" text="Jump to page"
                num={this.state.article.article.startPage}
                clickHandler={this.props.jumpToPage} />;

            for (var i=0; i<this.state.article.article.tags.length; i++){
                var tag = this.state.article.article.tags[i].tag;
                var text = tag.name;
                if (tag.synonymSelected){
                    var text =
                    <div>
                        <b>{tag.name}</b>:<br/>
                        <span>{tag.synonymSelected}</span>
                    </div>;
                }
                tags.push(<Button type="info" text={text} clickHandler={this.removeArticleTag.bind(this)} />);
            }
        }

        var options = [];
        var select = null;
        for (i in this.state.articles){
            var name = this.state.articles[i].article.name;
            options.push({'text': name, 'value': name});
        }
        if (this.state.articles.length > 0){
            select = <Select name='article' options={options} setFormState={this.chooseArticle.bind(this)} />;
        }

        return (
            <div style={position} >
                {opener}
                <div className="container" style={{height: this.state.height, overflow: "scroll"}}>
                    <br/>
                    <h3>Search Tags</h3>

                    <div>
                        Choose Article to Edit
                        {select}
                        {jumpToPage}
                        <br/>
                    </div>

                    <div>
                        <div>Search for tags to add.</div>
                        <TextAutocomplete options={tagNames} name="search"
                            value={this.state.searchString}
                            handlechange={this.updateSearch.bind(this)}
                            autocompleteSelect={this.addArticleTag.bind(this)}
                        />
                    </div>

                    <div>
                        <div>Current Tags:</div>
                        {tags}
                    </div>

                    <br/>
                </div>
            </div>
        );
    }
}



export default CodeViewer;
