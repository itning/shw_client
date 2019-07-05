import axios from 'axios'
import Vue from 'vue'
import {CAS_LOGIN_URL} from "@/api";

//12s超时
let instance = axios.create({timeout: 1000 * 12});

//请求拦截器
instance.interceptors.request.use((request) => {
  let token = window.localStorage.getItem('authorization_token');
  if (token !== undefined) {
    request.headers = {
      "Authorization": token,
      "Accept": "application/json"
    };
  } else {
    request.headers = {"Accept": "application/json"};
  }
  return request;

}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return Promise.resolve(response);
  },
  // 服务器状态码不是200的情况
  error => {
    if (error.response === undefined) {
      showErrorToast('网络异常');
      return Promise.reject(error);
    }
    if (error.response.status) {
      switch (error.response.status) {
        case 401:
          window.localStorage.setItem('last_path', window.location.pathname);
          setTimeout(() => {
            window.location.href = CAS_LOGIN_URL;
          }, 2000);
          once401Toast(error.response.data.msg);
          return;
        case 403:
          console.log("403");
          break;
        case 404:
          console.log("404");
          break;
        case 500:
          console.log("500");
          break;
        case 503:
          console.log("503");
          break;
        default:
          console.log(error.response.data.message);
      }
      return Promise.reject(error);
    }
  }
);

const showErrorToast = function (msg) {
  Vue.toasted.error(msg, {
    position: "top-right",
    icon: 'clear',
    duration: 5000,
  });
};

let show = false;
const once401Toast = function (msg) {
  if (show) {
    return;
  }
  Vue.toasted.error(msg, {
    position: "top-right",
    icon: 'clear'
  });
  show = true;
};

const Method = {GET: 0, POST: 1, DELETE: 2, UPDATE: 3, PUT: 4, PATCH: 5};

export function Get(url) {
  return new _request(url, Method.GET);
}

export function Del(url) {
  return new _request(url, Method.DELETE);
}

export function Post(url) {
  return new _request(url, Method.POST);
}

export function Patch(url) {
  return new _request(url, Method.PATCH);
}

function _request(url, method) {
  this.method = method;
  this.url = url;
  this.code = 200;
  this.startMsg = '错误：';
}

_request.prototype.withErrorStartMsg = function (msg) {
  this.startMsg = msg;
  return this;
};

_request.prototype.withSuccessCode = function (code) {
  this.code = code;
  return this;
};

_request.prototype.withURLSearchParams = function (params) {
  let urlSearchParams = new URLSearchParams();
  for (let p in params) {
    if (params.hasOwnProperty(p)) {
      let v = params[p];
      urlSearchParams.append(p, v);
    }
  }
  this.urlSearchParams = urlSearchParams;
  return this;
};

_request.prototype.withFormData = function (params, enableUploadProgress = true) {
  let formData = new FormData();
  for (let p in params) {
    if (params.hasOwnProperty(p)) {
      let v = params[p];
      formData.append(p, v);
    }
  }
  this.formData = formData;
  this.enableUploadProgress = enableUploadProgress;
  return this;
};

_request.prototype.doAfter = function (fn) {
  this.doAfterFun = fn;
  return this;
};

_request.prototype.do = function (fn) {
  let that = this;
  let promise = null;
  let uploadToast = null;
  switch (this.method) {
    case Method.GET:
      promise = instance.get(this.url);
      break;
    case Method.DELETE:
      promise = instance.delete(this.url);
      break;
    case Method.POST:
      if (this.urlSearchParams !== undefined) {
        promise = instance.post(this.url, this.urlSearchParams);
      } else if (this.formData !== undefined) {
        if (this.enableUploadProgress === false) {
          promise = instance.post(this.url, this.formData, {headers: {'content-type': 'multipart/form-data'}});
        } else {
          uploadToast = Vue.toasted.info('正在上传：0%', {
            position: "top-right",
            icon: 'hourglass_empty'
          });
          let config = {
            headers: {'content-type': 'multipart/form-data'},
            timeout: 1000 * 60 * 5,
            onUploadProgress: progressEvent => {
              let progress = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%';
              uploadToast.text("正在上传：" + progress);
              if (progress === '100%') {
                uploadToast.goAway(100);
              }
            }
          };
          promise = instance.post(this.url, this.formData, config);
        }
      } else {
        promise = instance.post(this.url);
      }
      break;
    case Method.PATCH:
      if (this.urlSearchParams !== undefined) {
        promise = instance.patch(this.url, this.urlSearchParams);
      } else if (this.formData !== undefined) {
        promise = instance.patch(this.url, this.formData, {headers: {'content-type': 'multipart/form-data'}});
      } else {
        promise = instance.patch(this.url);
      }
      break;
    default:
      return Promise.reject('none switch found of ' + this.method);
  }
  promise
    .then(response => {
      if (response.status === that.code) {
        fn(response)
      } else {
        showErrorToast(that.startMsg + response.data.msg);
      }
    })
    .catch(error => {
      if (uploadToast !== null) {
        uploadToast.goAway(100);
      }
      if (error.response !== undefined) {
        showErrorToast(that.startMsg + error.response.data.msg);
      }
    })
    .then(() => {
      if (that.doAfterFun !== undefined) {
        that.doAfterFun();
      }
    });
  return this;
};

export default instance;

