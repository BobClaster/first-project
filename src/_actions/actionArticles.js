'use strict';

import * as Actions from './actionTypes';
import Api from '../_api';

export const fetchArticlesList = () => {
    return dispatch => {
        return Api.getArticleList()
            .then(resp => {
                // dispatch({
                //     type: Actions.FETCHED_ARTICLES_LIST,
                //     data,
                //     // data_projects
                // })
                console.log(resp);
            })
            .catch(err => {
                // const { message } = err;
                //
                // dispatch({ type: Actions.FETCHED_PROJECTS_LIST_FAILD, data: message })
            })
    }
};