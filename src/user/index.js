import {CAS_LOGIN_URL} from "@/api";
import {Base64} from 'js-base64';

let User = {};
let loginUser = init();

function init() {
  if (window.localStorage.getItem('authorization_token') === null) {
    window.localStorage.setItem('last_path', window.location.pathname);
    window.location.href = CAS_LOGIN_URL;
    return {};
  }
  return JSON.parse(JSON.parse(
    Base64.decode(
      window.localStorage.getItem('authorization_token')
        .split('.')[1]
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
