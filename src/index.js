import React from 'react';
import ReactDOM from 'react-dom';
import Nav from './container/Navbar';
import AllArticle from './components/AllArticle';
import ArticleDetail from './components/ArticleDetail';
import UserProfile from './components/UserProfile';
import { BrowserRouter as Router, Route } from "react-router-dom";

const Urls = () => {
    return (
        <div className='container'>
            <div className="col-md-12" style={{padding: "0 0 20px 0"}}>
                <Nav />
            </div>
            <Router>
                <div>
                    <Route exact path="/articles" component={AllArticle} />
                    <Route path="/articles/:id" component={ArticleDetail} />
                    <Route path="/user/:id" component={UserProfile} />
                </div>
            </Router>
        </div>
    )
};

ReactDOM.render(Urls(), document.getElementById('root')

);
