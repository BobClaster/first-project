import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import LoginForm from './LoginForm';
import {login} from  '../_actions/actionAuth';
import {authErrors, isAuthenticated} from '../_reducers';

const Login = (props) => {
    console.log(props);
    if (props.isAuthenticated) {
        return (
            <Redirect to='/'/>
        )
    } else {
        return (
            <div className="login-page">
                <LoginForm {...props}/>
            </div>
        )
    }
};

const mapStateToProps = (state) => ({
    errors: authErrors(state),
    isAuthenticated: isAuthenticated(state)
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (username, password) => {
        dispatch(login(username, password))
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(Login);