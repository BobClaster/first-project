// import React, {Component} from 'react';
// import { connect } from 'react-redux';
// import { Route, Switch } from 'react-router-dom';
// import { push } from 'react-router-redux';
//
// import { store } from './store';
// import { APP_LOAD, REDIRECT } from './_actions/actionTypes';
//
// import Home from './Home/index';
// import Article from './Article/ArticlesList';
//
//
//
// class App extends Component {
//
//
//     render() {
//         return (
//             <div>
//                 {/*<Header*/}
//                     {/*appName={this.props.appName}*/}
//                     {/*currentUser={this.props.currentUser} />*/}
//                 <Switch>
//                     {/*<Route exact path="/" component={Home}/>*/}
//                     <Route exact path="/articles" component={Article}/>
//
//                 </Switch>
//             </div>
//         );
//
//         // return (
//         //     <div>
//         //         <Header
//         //             appName={this.props.appName}
//         //             currentUser={this.props.currentUser} />
//         //         Loading..
//         //     </div>
//         // );
//     }
// }
//
//
// // export default connect(mapStateToProps, mapDispatchToProps)(App);


import React, { Component } from 'react';
import { connect } from 'react-redux'

import {echo} from './_actions/echo'
import {serverMessage} from './_reducers/echo'

class App extends Component {
    componentDidMount() {
        this.props.fetchMessage('Hi!')
    }

    render() {
        return (
            <div>
                <h2>Welcome to React</h2>
                <p>{this.props.message}</p>
            </div>
        );
    }
}

export default connect(
    state => ({ message: serverMessage(state) }),
    { fetchMessage: echo }
)(App);