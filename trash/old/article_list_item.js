import React from "react";

const ArticleListItem = ({article}) => {
    const imageURL = article.cover_img;
    const link = "/articles/" + article.id;
    return (
        <a href={link}>
            <li className="col-md-3">
                <div className="media">
                    <div className="">
                    <img src={imageURL} alt="img" className="article-list-image" />
                </div>
                <div className="media-heading">
                    <h4>{article.title}</h4>
                    </div>
                </div>
            </li>
        </a>
    );
};

export default ArticleListItem;
