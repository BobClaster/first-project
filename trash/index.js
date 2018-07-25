'use strict';

import Constants from '../constants';
import 'whatwg-fetch';
import fetchRequest from '../helpers/fetchRequest';

class ProjectApi {

  // User
  static userGetToken(data) {
    const { password, username } = data;

    const request = `${Constants.API_HOST}/rest-auth/login/?p=`;
    const headers = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({password, username})
    }

    return fetchRequest(request, headers);

  }

  static userResetPassword(email) {
    const request = `${Constants.API_HOST}/rest-auth/password/reset/`;
    const headers = {

      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email})
    }
    return fetchRequest(request, headers);
  }

  static fetchUsersList(token){

    const request = `${Constants.API_HOST}/api/v1/users/users/`;
    const headers = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    }

    return fetchRequest(request, headers);
  }

  // Profile settings

  static userPatch(data) {
    const {token, user_id, first_name, last_name, organization} = data;
    const request = `${Constants.API_HOST}/api/v1/users/users/${user_id}/`;
    const headers = {

      method: 'PATCH',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
      },
      body: JSON.stringify({first_name, last_name, organization})
    }
    return fetchRequest(request, headers);
  }

  static userChangePassword(data) {
    const {token, old_password, new_password } = data;

    const request = `${Constants.API_HOST}/rest-auth/password/change/`;
    const headers = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({new_password, old_password})
    }
    return fetchRequest(request, headers);
  }

  // Documents List
  static fetchDocumentsByProject(data) {
    const { token, project_id, page, offset, uid, order } = data;

    const sortdatafield = uid && uid.split('-').join('_')

    const request = `${Constants.API_HOST}/api/${Constants.API_VERSION}/document/project/${project_id}/documents/?enable_pagination=true&pagesize=${offset}&pagenum=${page}&sortdatafield=${sortdatafield}&sortorder=${order}&filterscount=0&total_records=true`;
    const headers = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
    }

    return fetchRequest(request, headers);

  }


  // Documents Type List
  static fetchDocumentTypesListByType(data) {
    const { token, uid } = data;

    const request = `${Constants.API_HOST}/api/${Constants.API_VERSION}/document/document-types/${uid}/`;
    const headers = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
    }

    return fetchRequest(request, headers);

  }

  static getDocumentTypes(data) {
    const { token } = data;

    const request = `${Constants.API_HOST}/api/${Constants.API_VERSION}/document/document-types/`;
    const headers = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    }

    return fetchRequest(request, headers);

  }

  static fetchProjectsList(token) {

    const request = `${Constants.API_HOST}/api/${Constants.API_VERSION}/project/projects/`;
    const headers = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    }

    return fetchRequest(request, headers);

  }

  static createProject(data) {
    const { name, type, token } = data;

    const request = `${Constants.API_HOST}/api/${Constants.API_VERSION}/project/projects/`;
    const headers = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({name, type})
    }

    return fetchRequest(request, headers);

  }

  static fetchSingleProject(data) {
    const { project_id, token } = data;

    const request = `${Constants.API_HOST}/api/${Constants.API_VERSION}/project/projects/${project_id}/`;
    const headers = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    }

    return fetchRequest(request, headers);

  }

  static getUploadSession(data) {
    const { token, project, user_id } = data;

    const request = `${Constants.API_HOST}/api/${Constants.API_VERSION}/project/upload-session/`;
    const headers = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({project, created_by: user_id})
    }

    return fetchRequest(request, headers);

  }

  static uploadFile(data) {
    const { token, session_id, file, send_email_notifications, user_id } = data;
    const formData = new FormData();

    formData.append("file", file);
    formData.append("send_email_notifications", send_email_notifications);

    const request = `${Constants.API_HOST}/api/${Constants.API_VERSION}/project/upload-session/${session_id}/upload/`;
    const headers = {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formData
    }

    return fetchRequest(request, headers);

  }

  static launchClastering(data) {
    const { token, id, params } = data;
    const { method, n_clusters } = params;
    const formData = new FormData();

    formData.append("method", method.value);
    formData.append("n_clusters", n_clusters);


    const request = `${Constants.API_HOST}/api/v1/project/projects/${id}/cluster/`;
    const headers = {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formData
    }

    return fetchRequest(request, headers);

  }

  static clusteringProgress(data) {
    const { token, id } = data;

    const request = `${Constants.API_HOST}/api/v1/project/projects/${id}/clustering-status/`;
    const headers = {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      }
    }

    return fetchRequest(request, headers);

  }

  static checkSessionProgress(data) {
    const { token, id } = data;

    return fetch(`${Constants.API_HOST}/api/v1/project/projects/${id}/progress/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`
        }
    }).then(response => {
      return response.json();
    }).catch(error => {
      return error;
    });

  }

  static fetchClusteredDocumentsList(data) {
    const { token, id } = data;

    const request = `${Constants.API_HOST}/api/v1/document/project/${id}/documents/`;
    const headers = {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    }

    return fetchRequest(request, headers);

  }

  static checkParsingProgress(data) {
    const { token, uid } = data;

    const request = `${Constants.API_HOST}/api/v1/project/upload-session/${uid}/progress/`;
    const headers = {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    }

    return fetchRequest(request, headers);

  }

  static removeFile(data) {
    const { token, document_id } = data;

    return fetch(`${Constants.API_HOST}/api/v1/document/documents/${document_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
    }).then(response => {

      return response.text().then(function(text) {
        return text ? JSON.parse(text) : {}
      })

    }).catch(error => {
      return error;
    });

  }

  static applyCluster(data) {
    const { token, project_id, cluster_ids, id } = data;
    const formData = new FormData();
    formData.append("project_id", project_id);
    for(let key in cluster_ids){
      if(cluster_ids.hasOwnProperty(key)) formData.append("cluster_ids", cluster_ids[key]);
    }

    const request = `${Constants.API_HOST}/api/v1/project/projects/${id}/send-clusters-to-project/`;
    const headers = {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formData
    }

    return fetchRequest(request, headers);


  }

  static fetchDocument(data) {
    const { token, project_id, id } = data;

    const request = `${Constants.API_HOST}/api/v1/document/project/${project_id}/documents/${id}/`;
    const headers = {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    }

    return fetchRequest(request, headers);

  }

  static fetchDocumentAnnotations(data) {
    const { id, token } = data;

    const request = `${Constants.API_HOST}/api/v1/annotator/search?document_id=${id}`;
    const headers = {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    }

    return fetchRequest(request, headers);

  }

  static fetchDocumentExtractions(data) {
    const { id, token } = data;

    const request = `${Constants.API_HOST}/api/v1/document/documents/${id}/extraction/`;
    const headers = {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    }

    return fetchRequest(request, headers);

  }

  static saveAnnotation(data) {
    const { id, token } = data;
    const { body } = data;

    const request = `${Constants.API_HOST}/api/v1/annotator/annotations`;
    const headers = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(body)
    }

    return fetchRequest(request, headers);

  }

  static updateAnnotation(data) {
    const { id, uid, annotation, token } = data;

    const request = `${Constants.API_HOST}/api/v1/annotator/annotations/${id}`;
    const headers = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(annotation)
    }

    return fetchRequest(request, headers);

  }

  static deleteAnnotation(data) {
    const { id, token } = data;

    const request = `${Constants.API_HOST}/api/v1/annotator/annotations/${id}`;
    const headers = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    }

    return fetchRequest(request, headers);

  }

  static changeDocumentStatus(data) {
    const { id, value, token } = data;

    const request = `${Constants.API_HOST}/api/v1/document/documents/${id}/`;
    const headers = {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(value)
    }

    return fetchRequest(request, headers);

  }

}

export default ProjectApi;
