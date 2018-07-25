import React, { Component } from 'react';
import ArticleList from './article_list';


class AllArticle extends Component {
  constructor() {
    super();
    this.state = {
      articles: [],
      numb: 0,
      next: null,
      previous: null,
      selectedArticle: null
    };
  }

  componentWillMount() {
    fetch("http://127.0.0.1:8000/articles/api")
    .then(res => {
      return res.json();
    }).then(data => {
      this.setState({
        articles: data.results,
        numb: data.count,
        next: data.next,
        previous: data.previous});
      console.log("state", this.state);
    });
  }

  render() {
    return (
      <div>
          <hr/>
          <ArticleList
              articles={this.state.articles}
            />
      </div>


    );
  }
}

export default AllArticle;
