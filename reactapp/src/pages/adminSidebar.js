import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';
import ajaxWrapper from "base/ajax.js";

import {
    Card, Container, Button, Image, Form, Select,
    TextInput, Navbar, List, Link, Accordion, Sidebar,
    Paragraph, RadioButton, TextArea, Header, TextAutocomplete
} from 'library';


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
        ajaxWrapper("POST",  "/api/home/chapter/" + id + '/?related=tags&', data, this.refreshChapterResponse.bind(this));
    }

    removeChapterTag(e) {
        var id = this.state.chapter.id;
        var tagId = e.currentTarget.getAttribute('num');

        var data = {
            "tags[]__remove": JSON.stringify([tagId])
        };
        ajaxWrapper("POST",  "/api/home/chapter/" + id + '/?related=tags&', data, this.refreshChapterResponse.bind(this));
    }

    refreshChapterResponse(result) {
        var articles = this.state.articles;
        var article = this.state.article;
        article.chapters[result[0].chapter.id] = result[0].chapter;
        articles[article.id] = article;

        this.setState({
            searchString: "",
            chapter: result[0].chapter,
            article: article,
            articles: articles
        });
    }

    render() {
        var jumpToPage = null;
        var tags = [];
        var tagJSX = null;
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

            tagJSX =
            <div>
                <TextAutocomplete label="Search for tags to add."
                    options={this.props.tagNames} name="search"
                    value={this.state.searchString}
                    handlechange={this.updateSearch.bind(this)}
                    autocompleteSelect={this.addChapterTag.bind(this)}
                />
                <br/>

                <div>Current Tags: (click to remove)</div>
                {tags}
            </div>;
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

            {tagJSX}
        </div>;


        return (
            <Sidebar content={content} loaded={true} widthPercent={50} headerHeight={67}
                openerText="Admin: Chapter Tags" openerPosition="160px"
                toggleOpen={this.props.toggleOpen}
            />
        );
    }
}



export default AdminSidebar;
