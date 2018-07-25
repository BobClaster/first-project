import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import {Route, Switch} from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import Login from './Auth/Login';
import PrivateRoute from './Auth/PrivateRouter';
// import './index.css';
// import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import configureStore from './store';

const history = createHistory();
const store = configureStore(history);


ReactDOM.render((
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route exact path="/login/" component={Login} />
                <PrivateRoute path="/" component={App}/>
            </Switch>
        </ConnectedRouter>
    </Provider>
), document.getElementById('root'));