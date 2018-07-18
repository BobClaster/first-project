import React from 'react';
import ArticleListItem from './article_list_item';

const ArticleList = (props) => {
  const articleItem = props.articles.map(article => {
    return <ArticleListItem
      onArticleSelect = {props.onArticleSelect}
      key={article.id}
      article={article}
    />
  });

  return (
    <ul className="list-group col-md-12">
      {articleItem}
    </ul>
  );
}

export default ArticleList;
