import React from 'react';
import {Constants} from './constants';

export default class ProjectApi {

    static getArticleList(data) {
        return fetch(`${Constants.API_HOST}/articles/api`)
            .then(res => {
                return res.json();
            });
    };

    static getArticleDetail(data) {
        return fetch(`${Constants.API_HOST}/articles/api/${data.id}`)
            .then(res => {
                return res.json();
            });
    };

}
