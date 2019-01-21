import Cookies from "js-cookie";
import {CAS_LOGIN_URL} from "@/api";

let User = {};
let loginUser = init();

function init() {
  let authorization = Cookies.get('Authorization');
  if (authorization !== undefined) {
    window.localStorage.setItem('authorization_token', authorization);
    Cookies.remove('Authorization');
  }
  if (window.localStorage.getItem('authorization_token') === null) {
    window.localStorage.setItem('last_path', window.location.pathname);
    window.location.href = CAS_LOGIN_URL;
    return {};
  }
  return JSON.parse(JSON.parse(
    decodeURIComponent(
      escape(
        window.atob(
          window.localStorage.getItem('authorization_token')
            .split('.')[1]
        )
      )
    )
  ).loginUser);
}

User.loginUser = loginUser;
User.loginName = loginUser.name;
User.user_is_student = loginUser.userType === '99';
User.user_is_teacher = loginUser.userType === '13';

User.install = function (Vue, options) {
  Vue.prototype.$user = User;
};
export default User;
