import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from "base/ajax.js";

import {
    Card, Container, Button, Image, Form, Select,
    TextInput, Navbar, List, Link, Accordion, Sidebar,
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
            selectedTags: [], searchString: "", searchResults: [],
            resultList: null
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

        var tagNames = this.createTagNameDict();

        var adminTools = null;
        if (this.props.user && this.props.user.is_staff){
            adminTools =
            <div>
                <AdminSidebar
                    tags={this.state.tags}
                    tagNames={tagNames}
                    jumpToPage={this.jumpToPage.bind(this)}
                />

                <AdminTagSidebar />
            </div>;
        }

        var content =
        <div>
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
            />

            {adminTools}
        </div>;

        return (
            <Wrapper loaded={this.state.loaded}  content={content} />
        );
    }
}


class SearchSidebar extends Component {
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
            <form autoComplete="new-password">
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
                widthPercent={50} headerHeight={67} />
        );
    }
}

class AdminSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            article: null,
            chapter: null,
            searchString: ""
        };
    }

    componentDidMount() {
        this.getChapters();
    }

    toggle() {
        if (this.state.open){
            this.setState({ open: false});
        } else {
            this.setState({ open: true});
        }
    }

    getChapters() {
      ajaxWrapper("GET",  "/api/home/article/?related=chapters,chapters__tags", {}, this.loadChapters.bind(this));
    }
    loadChapters(result) {
        var articles = {};
        for (var i in result){
            var article = result[i].article;
            var chapters = {};
            for (var j in article.chapters){
                var chapter = article.chapters[j].chapter;
                chapters[chapter.id] = chapter;
            }

            article.chapters = chapters;
            articles[article.id] = article;
        }

        this.setState({
            articles: articles
        });
    }

    updateSearch(e) {
        this.setState({
            searchString: e.target.value
        });
    }

    chooseArticle(e) {
        var selected = this.state.articles[e['article']];
        this.setState({
            article: selected
        });
    }
    chooseChapter(e) {
        var selected = this.state.article.chapters[e['chapter']];
        this.setState({
            chapter: selected
        });
    }

    addChapterTag(e) {
        var id = this.state.chapter.id;
        var tagId = e.currentTarget.getAttribute('num');

        var data = {
            "tags[]": JSON.stringify([tagId])
        };
        ajaxWrapper("POST",  "/api/home/chapter/" + id + '/?related=tags&', data, this.addTagResponse.bind(this));
    }

    addTagResponse(result) {
        this.setState({
            searchString: "",
            chapter: result[0].chapter
        });
    }

    removeChapterTag(e) {
        var id = this.state.chapter.id;
        var tagId = e.currentTarget.getAttribute('num');

        var data = {
            "tags[]__remove": JSON.stringify([tagId])
        };
        ajaxWrapper("POST",  "/api/home/chapter/" + id + '/?related=tags&', data, this.removeTagResponse.bind(this));
    }
    removeTagResponse(result) {
        this.setState({
            searchString: "",
            chapter: result[0].chapter
        });
    }

    render() {
        var jumpToPage = null;
        var tags = [];
        if (this.state.chapter){
            jumpToPage = <Button type="primary" text="Jump to page"
                num={this.state.chapter.startPage_id}
                clickHandler={this.props.jumpToPage} />;

            var chapterTags = this.state.chapter.tags;
            for (var i=0; i<chapterTags.length; i++){
                var tag = chapterTags[i].tag;
                var text = tag.name;
                if (tag.synonymSelected){
                    var text = tag.synonymSelected;
                }
                tags.push(<Button type="info" text={text} num={tag.id} clickHandler={this.removeChapterTag.bind(this)} />);
            }
        }

        var articleOptions = [];
        var articleSelect = null;
        for (var key in this.state.articles){
            var article = this.state.articles[key];
            articleOptions.push({'text': article.name, 'value': article.id});
        }
        if (Object.keys(this.state.articles).length > 0){
            articleSelect = <Select label="Choose Article to Edit" name='article' options={articleOptions} setFormState={this.chooseArticle.bind(this)} />;
        }

        var options = [];
        var select = null;
        if (this.state.article){
            for (var key in this.state.article.chapters){
                var chapter = this.state.article.chapters[key];
                options.push({'text': chapter.name, 'value': chapter.id});
            }
            if (Object.keys(this.state.article.chapters).length > 0){
                select = <Select label="Choose Chapter to Edit" name='chapter' options={options} setFormState={this.chooseChapter.bind(this)} />;
            }
        }


        var content =
        <div>
            <h3>Admin: Chapter Tags</h3>

            <div>
                {articleSelect}
                {select}
                {jumpToPage}
                <br/><br/>
            </div>

            <div>
                <TextAutocomplete label="Search for tags to add."
                    options={this.props.tagNames} name="search"
                    value={this.state.searchString}
                    handlechange={this.updateSearch.bind(this)}
                    autocompleteSelect={this.addChapterTag.bind(this)}
                />
            </div>

            <div>
                <div>Current Tags: (click to remove)</div>
                {tags}
            </div>
        </div>;


        return (
            <Sidebar content={content} widthPercent={50} headerHeight={67}
                openerText="Admin: Chapter Tags" openerPosition="90px"
            />
        );
    }
}


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
        ajaxWrapper("POST",  "/api/home/tag/?related=synonyms", data, this.createTagResponse.bind(this));
    }
    createTagResponse(result) {
        var tags = this.state.tags;
        tags[result[0].tag.id] = result[0].tag;

        this.setState({
            tag: result[0].tag,
            tags: tags,
            tagName: ""
        });
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
        this.setState({
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
                openerText="Admin: Tags & Synonyms" openerPosition="160px"
            />
        );
    }
}



export default CodeViewer;
