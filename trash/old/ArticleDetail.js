import React, { Component } from 'react';
import MarkdownRenderer from 'react-markdown-renderer';

class ArticleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: {},
    };
  }

  componentWillMount() {
    fetch('http://127.0.0.1:8000/articles/api/' + this.props.match.params.id)
    .then(res => {
      return res.json();
    }).then(article => {
      this.setState({article});
    });
  }

  render() {
     const article = this.state.article;
     if (article.author) {
         console.log(article);
         return (
             <div>
                 <div className="col-md-8 title-block-article">
                     <h1>{article.title}</h1>
                     <h6 className="date-published-article">{article.date_published}</h6>
                 </div>
                 <div className="col-md-4 user-block-article">
                     <img src={article.author.avatar} alt="img" className="user-avatar-article img-rounded " />
                     <div className="username-article">
                         <a href={"/user/"+article.author.id}><h4>{article.author.name}</h4></a>
                         <h6 className="user-position-article">{article.author.position}</h6>
                     </div>
                 </div>
                 <div className="col-md-12">
                     <hr />
                     <div> <MarkdownRenderer markdown={article.text} /> </div>
                 </div>
             </div>
         );
     } else {
         return (
             <div className="container">
                 <h5>Loading...</h5>
             </div>
         );
     }

  }
}

export default ArticleDetail;
