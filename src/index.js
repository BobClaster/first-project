import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ArticleList from './components/article_list';


class App extends Component {
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
      <div className="container">
        <ArticleList
          onArticleSelect={article => this.setState({selectedArticle: article})}
          articles={this.state.articles}
        />
      </div>


    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
