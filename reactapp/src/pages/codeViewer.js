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
        var tags = {};
        for (var i in result){
            var tag = result[i].tag;
            tags[tag.id] = tag;
        }

        this.setState({tags: tags});
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
        var url = "/api/home/article/?order_by=id&related=text,tags&";
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

            <AdminTagSidebar />
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
            width: this.state.width,
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
            right: this.state.width,
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

        var tagNames = {};
        for (var key in this.props.tags){
            var tag = this.props.tags[key];

            tagNames[tag.name] = tag.id;
            for (var j=0; j<tag.synonyms.length; j++){
                tagNames[tag.synonyms[j].synonym.name + " ("+ tag.name +")"] = tag.id;
            }
        }

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

        var results = [];
        var resultList = null;
        for (var i in this.props.searchResults){
            var article = this.props.searchResults[i].article;
            var result = {page: article.startPage_id, texts: [], tags: []};

            for (var j in this.props.selectedTags){
                var tag = this.props.selectedTags[j];
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

                for (var k in article.tags){
                    var articleTag = article.tags[k].tag;
                    if (articleTag.name == tag.name) {
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
                    <form autoComplete="new-password">
                        <TextAutocomplete label="Search one or more items"
                            options={tagNames} name="search"
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
        var tagId = e.currentTarget.getAttribute('num');

        var data = {
            "tags[]": JSON.stringify([tagId])
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
        var id = this.state.article.article.id;
        var tagId = e.currentTarget.getAttribute('num');

        var data = {
            "tags[]__remove": JSON.stringify([tagId])
        };
        ajaxWrapper("POST",  "/api/home/article/" + id + '/?related=tags&', data, this.removeTagResponse.bind(this));
    }
    removeTagResponse(result) {
        this.setState({
            searchString: "",
            article: result[0]
        });
    }

    render() {
        var position = {
            position: "fixed",
            top: "67px",
            right: "0px",
            width: this.state.width,
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
            right: this.state.width,
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

        var tagNames = {};
        for (var key in this.props.tags){
            var tag = this.props.tags[key];

            tagNames[tag.name] = tag.id;
            for (var j=0; j<tag.synonyms.length; j++){
                tagNames[tag.synonyms[j].synonym.name + " ("+ tag.name +")"] = tag.id;
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
                    var text = tag.synonymSelected;
                }
                tags.push(<Button type="info" text={text} num={tag.id} clickHandler={this.removeArticleTag.bind(this)} />);
            }
        }

        var options = [];
        var select = null;
        for (i in this.state.articles){
            var name = this.state.articles[i].article.name;
            options.push({'text': name, 'value': name});
        }
        if (this.state.articles.length > 0){
            select = <Select label="Choose Article to Edit" name='article' options={options} setFormState={this.chooseArticle.bind(this)} />;
        }

        return (
            <div style={position} >
                {opener}
                <div className="container" style={{height: this.state.height, overflow: "scroll"}}>
                    <br/>
                    <h3>Admin: Article Tags</h3>

                    <div>
                        {select}
                        {jumpToPage}
                        <br/><br/>
                    </div>

                    <div>
                        <TextAutocomplete label="Search for tags to add."
                            options={tagNames} name="search"
                            value={this.state.searchString}
                            handlechange={this.updateSearch.bind(this)}
                            autocompleteSelect={this.addArticleTag.bind(this)}
                        />
                    </div>

                    <div>
                        <div>Current Tags: (click to remove)</div>
                        {tags}
                    </div>

                    <br/>
                </div>
            </div>
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
        var position = {
            position: "fixed",
            top: "67px",
            right: "0px",
            width: this.state.width,
            background: "white",
            boxShadow: 'rgba(0, 0, 0, 0.2) -2px 2px 5px'
        }
        var toggleText = "Close";
        if (!this.state.open){
            position['right'] = "-" + this.state.width;
            toggleText = "Admin Tags";
        }

        var openerStyle = {
            position: 'absolute',
            top: '180px',
            right: this.state.width,
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
        return (
            <div style={position} >
                {opener}
                <div className="container" style={{height: this.state.height, overflow: "scroll"}}>
                    <br/>
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

                    <br/>
                </div>
            </div>
        );
    }
}



export default CodeViewer;
