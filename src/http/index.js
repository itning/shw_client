import axios from 'axios'
import {CAS_LOGIN_URL} from "@/api";

//12s超时 默认带Cookie
let instance = axios.create({timeout: 1000 * 12, withCredentials: true});

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return Promise.resolve(response);
  },
  // 服务器状态码不是200的情况
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 401:
          window.location.href = CAS_LOGIN_URL;
          break;
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

export default instance;

