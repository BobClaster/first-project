'use strict';

import * as Actions from './actionTypes';
import projectsApi from '../api';
import _ from 'lodash';
import { fetchClusteredDocumentsList, launchClastering } from './actionsCluster';

export const fetchProjectsList = () => {

  return (dispatch, getState) => {

    const { user } = getState();
    const { token } = user;

    dispatch({ type: Actions.START_FETCHING_PROJECTS_LIST })

    return projectsApi.fetchProjectsList(token)
      .then(resp => {
        const transform_data_array = _.map(resp, (item, index) => { return { ...item, documents_list: [] } });
        const data = _.keyBy(Object.values(transform_data_array), (o) => o.pk );
        // const keys = _.map(resp, 'pk');
        // const value = _.map(keys, (item, index) => setProjectData(resp[index]));
        // const data_projects = _.zipObject(keys, value);

        dispatch({
          type: Actions.FETCHED_PROJECTS_LIST,
          data,
          // data_projects
        })

      })
      .catch(err => {
        const { message } = err;

        dispatch({ type: Actions.FETCHED_PROJECTS_LIST_FAILD, data: message })
      })
  }
}


const setProjectData = (data) => {
  const { progress, type, type_data } = data;
  const { code } = type_data;

  const { project_tasks_completed, project_tasks_progress, completed_sessions, uncompleted_sessions } = progress;

  let session_status = false;
  let session_id = false;
  let complate = [];
  let parsing_progress = 0;
  const clustering = code === 'document.GenericDocument';

  if(uncompleted_sessions && clustering){
    session_id = Object.keys(uncompleted_sessions)[0]
    session_status = 'uploading';
  }
  if(completed_sessions && clustering){
    session_id = Object.keys(completed_sessions)[0]
    session_status = 'downloaded';
    parsing_progress = 100;
  }
  if(project_tasks_progress && clustering){
    session_status = 'clustering';
    complate = project_tasks_progress[Object.keys(project_tasks_progress)[0]];
    parsing_progress = 100;
    if(complate.completed) session_status = 'finished';
  }
  if(project_tasks_completed && clustering){
    session_status = 'finished';
    parsing_progress = 100;
  }

  // session_status = 'uploading';

  const projectState = {
    documents_list: [],
    type,
    save_project: false,
    session_id,
    load_files: [],
    files_uploading: false,
    project_status: false,
    file_in_process: false,
    files_counter: false,
    files_total_size: 0,
    files_size_loaded: 0,
    complate: {
      select_option: false,
      select_method: false,
      document_clusters: [],
      metadata: [],
      task: false,
      selected_counter: 0,
      selected_project: false,
      applying: false,
      clusters_unapplied: false,
      total_documents: false,
      clustered_documents: false,
      ...complate
    },
    session_status,
    on_hover_cluster: false,
    redirect: false,
    batch: clustering,
    parsing: false,
    parsing_progress,
    parsed_files: [],
    error: false,
    error_message: '',
    preloader: false,
  }

  return projectState;
}


export const createProject = (data) => {

  return (dispatch, getState) => {
    const { history, type_code } = data;
    const { user } = getState();
    const { token } = user;

    dispatch({ type: Actions.START_CREATING })

    return projectsApi.createProject({token, ...data})
      .then(resp => {

        dispatch({
          type: Actions.PROJECT_CREATED,
          data: resp,
          type_code
        })

      })
      .catch(err => {
        const { message } = err;

        dispatch({
          type: Actions.CREATING_FAILD,
          data: message
        })

      })
  }

}


export const getUploadSession = (id) => {

  return (dispatch, getState) => {
    const { user, project } = getState();
    const { token, user_id } = user;
    const { cluster } = project;

    return projectsApi.getUploadSession({ token, project: id, user_id })
      .then(resp => {

        // console.log(resp, 'CREATE SESSION')
        if(resp.hasOwnProperty('uid')){

          if(parseInt(cluster.project_id) === parseInt(id)) {

            dispatch({
              type: Actions.CLEAR_CLUSTER_SESSION
            })

          }

          dispatch({
            type: Actions.CREATE_SESSION,
            data: resp,
            id
          })


          dispatch({
            type: Actions.START_UPLOADING,
            id,
            // batch
          })
        } else {
          dispatch({
            type: Actions.CREATING_FAILD,
            data: 'Something went wrong',
            error: resp,
            id
          })
        }


      })
      .catch(err => {
        console.log('Something went wrong')


      })
  }

}


export const uploadFiles = (file, project_id, batch) => {

  return (dispatch, getState) => {
    const { user, project } = getState();
    const { token } = user;
    const { upload } = project;
    const { upload_list } = upload;
    const { files_counter, session_id, load_files } = upload_list[project_id]
    // const { load_files } = project_old[project_id];
    const { id } = file;
    const file_in_storage = _.find(load_files, (o) => { return o.id === id; });
    const index = _.indexOf(load_files, file_in_storage);
    // console.log(index, 'index');
    const send_email_notifications = index === 0;

    return projectsApi.uploadFile({token, session_id, file, send_email_notifications})
      .then(resp => {

        // const uploaded_file = successfully_uploaded + 1;

        if(resp === 'Loaded'){

          dispatch({
            type: Actions.FILE_LOADED,
            data: resp,
            id: index,
            status: 'loaded',
            project_id: parseInt(project_id),
            // uploaded_file,
            batch
          })

        }
        // } else {
        //   if(resp.hasOwnProperty('detail')) {

        //     dispatch({
        //       type: Actions.FILE_LOADED,
        //       data: resp,
        //       id: index,
        //       status: 'exist',
        //       project_id: parseInt(project_id),
        //       batch
        //     })

        //   }
        // }

        if(!(files_counter - 1)) dispatch(startParsingSession(project_id, session_id))

      })
      .catch(err => {
        const { message } = err;
        if(message === 'Already exists') {

          // const uploaded_file = successfully_uploaded;

          dispatch({
            type: Actions.FILE_LOADED,
            id: index,
            status: 'exist',
            // uploaded_file,
            project_id: parseInt(project_id),
            batch
          })

          if(!(files_counter - 1)) dispatch(startParsingSession(project_id, session_id))

        } else {
          dispatch({
            type: Actions.UPLOAD_ERROR,
            data: message,
            project_id,
          })
        }

      })
  }

}

export const clearUploadSession = id => {

  return {
    type: Actions.CLEAR_UPLOAD,
    id
  }

}


const startParsingSession = (project_id, session_id) => {

  return (dispatch, getState) => {
    const { upload } = getState().project;
    const { session_has_documents } = upload.upload_list[project_id];
    // const key = Object.keys(upload.upload_list).indexOf(project_id)
    // console.log(key, 'KEY');
    setTimeout(() => {

      if(!session_has_documents) {
        dispatch({
          type: Actions.UPLOAD_ERROR,
          data: 'duplicated',
          project_id
        })
      } else {
        dispatch(setParsingObject(project_id, session_id))
        dispatch(checkParsingProgress(project_id, session_id))
      }

    }, 1000)

  }

}


export const setParsingObject = (project_id, session_id) => {

  return {
    type: Actions.SET_PARSING_OBJECT,
    project_id,
    session_id,
    // index: key
  }

}


export const saveFileList = data => {
  const { files_total_size, files, id } = data;

  return {
    type: Actions.SAVE_FILE_DATA,
    files_total_size,
    data: files,
    id
  }

}


export const updateUploadStatus = id => {

  return {
    type: Actions.UPDATE_UPLOAD_STATUS,
    id
  }

}


export const startUploading = id => {

  return {
    type: Actions.START_UPLOADING,
    id
  }

}


// export const removeFile = data => {
//   const { index, id, document_id } = data;

//   return (dispatch, getState) => {
//     const { user, project } = getState();
//     const { token } = user;
//     const { upload } = project;
//     const { upload_list } = upload;
//     const { parsed_files, batch } = upload_list[id];

//     dispatch({
//       type: Actions.START_REMOVING_FILE,
//       id
//     })

//     // console.log(token, project)
//     // console.log('token')
//     // dispatch({ type: Actions.START_CREATING })
//     console.log(parsed_files, 'parsed_files', data)
//     return projectsApi.removeFile({ token, document_id })
//       .then(resp => {
//         console.log(parsed_files, 'parsed_files');
//         console.log(resp, 'DELETE DOCUMENT');

//         const check_cluster_availability = _.filter(parsed_files, item => {
//           if(item.status === 'SUCCESS' && item.document_id !== document_id) return item;
//         })

//         console.log('check_cluster_availability', check_cluster_availability);

//         if(parsed_files.length > 1 && !check_cluster_availability.length) dispatch({ type: Actions.SESSION_STATUS, id, session_status: false })

//         if(parsed_files.length === 1) {
//           // if(batch) dispatch(clearProject(id))
//           dispatch({ type: Actions.CLEAR_UPLOAD, id })
//         } else {
//           dispatch({
//             type: Actions.REMOVE_FILE,
//             index,
//             id
//           })
//         }

//       })
//       .catch(err => {
//         // dispatch({ type: Actions.CREATING_FAILD, data: err })
//       })
//   }

//   // return {
//   //   type: Actions.REMOVE_FILE,
//   //   index,
//   //   id
//   // }

// }


// const clearProject = id => {

//   return (dispatch, getState) => {
//     const { user } = getState();
//     const { token } = user;

//     return projectsApi.clearProject({ token, id })
//       .then(resp => {

//         if(resp === 'OK') {
//           dispatch({
//             type: Actions.RESET_PROJECT_UPLOAD_INSTANCE,
//             project_id: id
//           })
//         }

//       })
//       .catch(err => {

//       })
//   }

// }


// export const clearUpload = id => {

//   return {
//     type: Actions.CLEAR_UPLOAD,
//     id
//   }

// }


export const checkSessionProgress = id => {

  return (dispatch, getState) => {
    const { user } = getState();
    const { token } = user;

    return projectsApi.checkSessionProgress({ token, id })
      .then(resp => {
        // console.log(resp);
        const { session_status } = setProjectData({ type: false, progress: resp, type_data: { code: 'document.GenericDocument' } });
        // console.log(session_status)
        dispatch({
          type: Actions.SESSION_STATUS,
          data: session_status,
          id
        })

      })
      .catch(err => {
        // dispatch({ type: Actions.CREATING_FAILD, data: err })
      })
  }

}


export const checkParsingProgress = (id, uid) => {

  return (dispatch, getState) => {
    const { user, project } = getState();
    const { token } = user;
    const { cluster, contract, projects_list } = project;
    // let { files_size_loaded } = upload.parsed_list[id]

    return projectsApi.checkParsingProgress({ token, uid })
      .then(resp => {
        console.log(resp);
        console.log('resp');

        // const { document_tasks_progress_total }
        // if(resp.hasOwnProperty('session_status')){
          const { document_tasks_progress_total, document_tasks_progress } = resp;

          const data = Object.values(document_tasks_progress);
          const keys = Object.keys(document_tasks_progress);


          let files_size_loaded = 0;
          const { length } = _.filter(data, item => {
            if(item.tasks_overall_status === 'PENDING') return item
          })
          for(let key in data) {
            if(data.hasOwnProperty(key) && data[key].tasks_overall_status !== 'PENDING') files_size_loaded += data[key].file_size
          }

          if(document_tasks_progress_total === 100) {
            // const failed_data = _.filter(Object.values(document_tasks_progress), item => { if(item.tasks_overall_status === 'FAILURE') return item; })

            let unparsed_files = false;
            let complated_files = 0;
            let uncomplated_files = 0;
            const parse_data = _.map(data, (item, index) => {
              const { tasks_overall_status, document_id } = item;
              if(tasks_overall_status === 'FAILURE'){
                unparsed_files = true;
                uncomplated_files++;
              } else complated_files++;
              return { status: tasks_overall_status, document_id, name: keys[index] }
            })


            dispatch({
              type: Actions.PARSING_PROGRESS,
              data: resp,
              file_list_length: data.length,
              files_size_loaded,
              files_counter: length,
              id
            })

            setTimeout(() => {
              dispatch({
                type: Actions.PARSING_FINISHED,
                data: parse_data,
                unparsed_files,
                complated_files,
                uncomplated_files,
                files_counter: length,
                id
              })

              if(projects_list.list[id].type_data.code === 'document.GenericDocument') dispatch(launchClastering(id))
              if(parseInt(id) === cluster.project_id) dispatch(fetchClusteredDocumentsList(id))
              else {
                if(parseInt(id) == contract.project_id) {

                  const data = {
                    project_id: parseInt(id),
                    message: 'Documents loading...',
                    page: 0,
                    offset: 40,
                    load_more: false,
                  }

                  dispatch(fetchDocumentsList(data))
                }
              }
            }, 1000)

          } else {

            setTimeout(() => {
              dispatch(checkParsingProgress(id, uid))
            }, 5000)

            dispatch({
              type: Actions.PARSING_PROGRESS,
              data: resp,
              file_list_length: data.length,
              // load_files: data,
              files_size_loaded,
              files_counter: length,
              id
            })

          }
        // }

      })
      .catch(err => {
        const { message } = err;

        dispatch({ type: Actions.PARSING_FAILURE, data: message, project_id: id })
      })
  }

}

// Documents Grid

export const fetchDocumentsList = data => {

  const { project_id, message, page, offset, load_more, uid, order, filter_by } = data;

  return (dispatch, getState) => {

    const { user, project } = getState();
    const { token } = user;
    const { upload, projects_list } = project;

    // const { upload_list } = upload;
    // const current_project = upload_list[project_id];
    // const { batch, files_uploading, session_status } = current_project;

    // if(!batch && !files_uploading && session_status){
    //   dispatch({
    //     type: Actions.RESET_PROJECT_UPLOAD_INSTANCE,
    //     project_id
    //   })
    // }
    // const { project_id } = data;
    let total_records = null;
    if(load_more || filter_by) total_records = projects_list.total_records;

    dispatch({
      type: Actions.START_LOADING_DOCUMENTS_LIST,
      total_records,
      project_id,
      message
    })

    // console.log(data);
    return projectsApi.fetchDocumentsByProject({token, project_id, page, offset, uid, order})
      .then(resp => {
        // console.log(resp, 'resp')
        let load_more_documents;
        const { data: resp_data, total_records, reviewed_total } = resp;
        if(resp_data.length < offset) load_more_documents = false
        else load_more_documents = true

        if(load_more){
          let { page } = projects_list;
          page += 1;
          dispatch(loadMoreDocuments(project_id, resp_data, page, load_more_documents, total_records, reviewed_total))
        }

        if(filter_by) {
          const { index } = data;
          dispatch(loadFilteredDocuments(project_id, resp_data, load_more_documents, index, order, total_records, reviewed_total))
        }

        // console.log(resp_data);
        if(!load_more && !filter_by) dispatch(fetchedDocumentsListAction(project_id, resp_data, load_more_documents, total_records, reviewed_total))

      })
      .catch(err => {
        const { message } = err;

        dispatch({
          type: Actions.FETCHED_DOCUMENTS_LIST_ERRROR,
          data: message,
        })

        // alert('Something went wrong! Please, try again later!')
      })
  }

}


const fetchedDocumentsListAction = (project_id, data, load_more_documents, total_records, reviewed_total) => {

  return {
    type: Actions.FETCHED_DOCUMENTS_LIST,
    load_more_documents,
    reviewed_total,
    total_records,
    project_id,
    data,
  }

}


const loadFilteredDocuments = (project_id, data, load_more_documents, index, order, total_records) => {

  return {
    type: Actions.LAOD_FILTERED_DOCUMENTS,
    load_more_documents,
    total_records,
    project_id,
    index,
    order,
    data,
  }

}


const loadMoreDocuments = (project_id, data, page, load_more_documents, total_records) => {

  return {
    type: Actions.LOAD_MORE_DOCUMENTS,
    load_more_documents,
    total_records,
    project_id,
    data,
    page,
  }

}


// export const fetchLeasesItem = id => {

//   return (dispatch, getState) => {

//     const { user } = getState();
//     const { token } = user;

//     return projectsApi.fetchLeasesItem({token, id})
//       .then(resp => {

//         dispatch(fetchLeasesItemAction(resp))

//       })
//       .catch(err => {

//       })
//   }

// }


// const fetchLeasesItemAction = data => {

//   return {
//     type: Actions.FETCHED_LEASES_ITEM,
//     data
//   }

// }

// Fetch Leases Types

export const fetchDocumentTypes = uid => {

  return (dispatch, getState) => {

    const { user } = getState();
    const { token } = user;
    // const { uid } = data;
    // console.log(uid)
    return projectsApi.fetchDocumentTypesListByType({token, uid})
      .then(resp => {

        const { search_fields_data } = resp;
        const fields = _.map(search_fields_data, item => {
          return { ...item, sortorder: 'asc' }
        })

        dispatch(fetchLeasesTypesListAction(search_fields_data, fields, uid))

      })
      .catch(err => {
        console.log(err, 'error')

        dispatch({
          type: Actions.FETCHED_DOCUMENTS_TYPES_ERROR,
          data: 'Something went wrong! Please, try again later!'
        })

      })
  }

}


const fetchLeasesTypesListAction = (data, fields, uid) => {

  return {
    type: Actions.FETCHED_DOCUMENTS_TYPES,
    fields,
    data,
    uid
  }

}


// export const redirectTo = project_id => {

//   return {
//     type: Actions.REDIRECTED_ON_UPLOAD_DONE,
//     project_id
//   }

// }

// export const loadMoreDocuments = (data) => {
//   const { project_id, offset, page } = data;

//   return (dispatch, getState) => {

//     const { user } = getState();
//     const { token } = user;
//     // const { uid } = data;
//     // console.log(uid)
//     return projectsApi.fetchDocumentsByProject({token, project_id, offset, page})
//       .then(resp => {
//         // console.log(resp)
//         dispatch(fetchLeasesTypesListAction(resp, uid))

//       })
//       .catch(err => {
//         // console.log(err)
//       })
//   }

// }


export const fetchSingleContractProject = (project_id, settings = 0) => {

  return (dispatch, getState) => {

    const { user } = getState();
    const { token } = user;

    dispatch(clearContract());

    return projectsApi.fetchSingleProject({token, project_id})
      .then(resp => {
        // console.log('fetchSingleProject RESP');

        if(!resp.hasOwnProperty('detail')) {

          // const { uncompleted_sessions } = resp.progress;
          // const session_id = uncompleted_sessions && Object.keys(uncompleted_sessions)[0];
          // console.log(session_id)
          // console.log('session_id')
          // if(session_id){
          //   dispatch(setParsingObject(project_id, session_id))
          //   dispatch(checkParsingProgress(project_id, session_id))
          // }


          if (settings != 0) {
            dispatch({
              type: Actions.FETCHED_SETTINGS,
              data: resp,
            })

          } else {

            dispatch({
              type: Actions.SAVE_CONTRACT_PROJECT,
              data: resp,
            })
          }

        } else {

          dispatch({
            type: Actions.SAVE_CONTRACT_PROJECT_ERROR,
            data: resp.detail,
          })

        }

      })
      .catch(err => {
        const { message } = err;

        dispatch({
          type: Actions.SAVE_CONTRACT_PROJECT_ERROR,
          data: message,
        })

      })
  }

}


export const clearContract = () => {

  return {
    type: Actions.CLEAR_CONTRACT
  }

}


export const uploadModal = id => {

  return (dispatch, getState) => {
    const { upload } = getState().project;
    const { upload_modal } = upload;

    dispatch({
      type: Actions.MODAL_TOGGLE,
      upload_modal,
      id
    })

  }

}


export const projectCreateModal = (project_type=null) => {

  return (dispatch, getState) => {
    const { projects_list } = getState().project;
    const { project_create_modal } = projects_list;

    dispatch({
      type: Actions.PROJECT_CREATE_MODAL,
      project_create_modal,
      project_type
    })

  }

}


export const clearParsing = id => {

  return {
    type: Actions.CLEAR_PARSING,
    id
  }

}

export const closeErrorBlock = () => {

  return {
    type: Actions.CLOSE_CREATE_PROJECT_ERROR_BOX
  }

}