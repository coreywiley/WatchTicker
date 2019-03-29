import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';
import {Card, Button} from 'library';



class PageList extends Component {
    constructor(props) {
      super(props);

      this.state = {'pages':[], loaded: false}
      this.getPages = this.getPages.bind(this);

    }

    componentDidMount() {
      ajaxWrapper('GET','/api/modelWebsite/page/', {}, this.getPages)
    }

    getPages(result) {
      var pages = [];
      for (var index in result) {
        pages.push(result[index]['page'])
      }
      this.setState({'pages':pages, loaded:true})
    }

    render() {
        console.log("In Page List")
        var pages = [];
        for (var index in this.state.pages) {
          var page = this.state.pages[index]
          pages.push(<Card key={index} name={page['name']} description={page['url']} buttons={[<Button type={'primary'} href={'/pagebuilder/' + page['id'] + '/'} text={'Edit'} />]} />)
        }

        var content = <div className="container">
          <h1>Pages</h1>
          <Button type={'success'} text={'Add New Page'} href={'/pagebuilder/'} />
          <div className="row">
            {pages}
          </div>
        </div>

        return (
          <Wrapper content={content} loaded={this.state.loaded} />
        )

    }
}

export default PageList;
