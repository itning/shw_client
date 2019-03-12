import {Base64} from 'js-base64';

let User = {};
let loginUser = init();

function init() {
  if (window.localStorage.getItem('authorization_token') === null) {
    return {};
  }
  try {
    return JSON.parse(JSON.parse(
      Base64.decode(
        window.localStorage.getItem('authorization_token')
          .split('.')[1]
      )
    ).loginUser);
  } catch (e) {
    window.localStorage.removeItem('authorization_token');
    return {};
  }
}

User.loginUser = loginUser;
User.loginName = loginUser.name;
User.user_is_student = loginUser.userType === '99';
User.user_is_teacher = loginUser.userType !== '99';
User.supportPreviewFiles = {
  officeExtensionNames: ['.docx'],
  immediacyExtensionNames: ['.bmp', '.gif', '.png', '.jpeg', '.ico', '.jpg', '.pdf', '.htm', '.html', '.cpp', '.c', '.h', '.php', '.java', '.sql', '.bat', '.vue', '.js', '.json', '.cs', '.md', '.log', '.txt',],
  zipExtensionNames: ['.zip']
};

User.install = function (Vue, options) {
  Vue.prototype.$user = User;
};
export default User;
