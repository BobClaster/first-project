import React from "react";

const ArticleListItem = ({article, onArticleSelect}) => {
  const imageURL = article.cover_img;

  return (
    <li onClick={() => onArticleSelect(article)} className="list-group-item col-md-3">
      <div className="media">
        <div className="">
          <img src={imageURL} className="media-object" />
        </div>
        <div className="">
          <div className="media-heading">
            <h4>{article.title}</h4>
          </div>
        </div>
      </div>
    </li>
  );
}

export default ArticleListItem;
