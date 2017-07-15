import fetch from 'dva/fetch';
import { message } from 'antd';
import { getToken } from './util';
import { browserHistory,hashHistory } from 'dva/router';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options, call = () => { }, err = () => { }) {
  options.method = options.method || 'POST';
  let urls;
  if (url.indexOf('.') > 0) {
    urls = url;
  } else {
    urls = (options.domain ? getToken(options.domain) : 'http://192.168.1.22:88/') + url;
  }
  options.body = {
    data: options.body || {},
    token: getToken('userToken')
  }
  options.body = JSON.stringify(options.body);
  return fetch(urls, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      if (data.code === 20000) {
        call();
        data.message && message.success(data.message);

      } else {
        if (data.code === 49090) {
          setTimeout(() => {
            hashHistory.push('/login');
          }, 1000);
        }
        data.message && message.error(data.message);
      }
      return data;
    })
    .catch(err => ({ err }));
}
