import { RSAA } from 'redux-api-middleware';

export const LOGIN_REQUEST = '@@auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = '@@auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = '@@auth/LOGIN_FAILURE';

export const TOKEN_REQUEST = '@@auth/TOKEN_REQUEST';
export const TOKEN_RECEIVED = '@@auth/TOKEN_RECEIVED';
export const TOKEN_FAILURE = '@@auth/TOKEN_FAILURE';

const API_HOST = "http://127.0.0.1:8000";

export const login = (username, password) => ({
    [RSAA]: {
        endpoint: `${API_HOST}/user/api/signin/token/obtain/`,
        method: 'POST',
        body: JSON.stringify({username, password}),
        headers: { 'Content-Type': 'application/json' },
        types: [
            LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE
        ]
    }
});

export const refreshAccessToken = (token) => ({
    [RSAA]: {
        endpoint:  `${API_HOST}/user/api/signin/token/refresh/`,
        method: 'POST',
        body: JSON.stringify({refresh: token}),
        headers: { 'Content-Type': 'application/json' },
        types: [
            TOKEN_REQUEST, TOKEN_RECEIVED, TOKEN_FAILURE
        ]
    }
});