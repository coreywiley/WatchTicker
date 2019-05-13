import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import {Wrapper, Card, Button, Header} from 'library';



class PageList extends Component {
    constructor(props) {
      super(props);

      this.state = {'page_groups':[], loaded: false}
      this.getPages = this.getPages.bind(this);

    }

    componentDidMount() {
      ajaxWrapper('GET','/api/modelWebsite/pagegroup/?related=pages', {}, this.getPages)
    }

    getPages(result) {
      var pages = [];
      for (var index in result) {
        pages.push(result[index]['pagegroup'])
      }
      this.setState({'page_groups':pages, loaded:true})
    }

    render() {
        console.log("In Page List")
        var page_groups = [];
        for (var index in this.state.page_groups) {
          var page_group = this.state.page_groups[index]
          console.log("Page_group", page_group)

          var pages = [];
          for (var page_index in page_group['pages']) {
            var page = page_group['pages'][page_index]['page'];
            pages.push(<Card key={index} className={'col-3'} name={page['name']} description={page['url']} buttons={[<Button type={'primary'} href={'/pagebuilder/' + page_group['id'] + '/' + page['id'] + '/'} text={'Edit'} />, <Button type={'danger'} href={'/api/modelWebsite/page/' + page['id'] + '/delete/'} text={'Delete'} />]} />)
          }

          var page_group_html = <div>
              <Header text={page_group['name']} size={3} />
              <br />
              <Button text='Add New Page' type='success' href={'/pagebuilder/' + page_group['id'] + '/'} style={{marginBottom:'20px'}}/>
              <div class="row">
                {pages}
              </div>
          </div>;
          page_groups.push(page_group_html)
        }

        var content = <div className="container">
          {page_groups}
        </div>

        return (
          <Wrapper content={content} loaded={this.state.loaded} />
        )

    }
}

export default PageList;
