'use strict';
export const BASE_URL = "http://localhost:8080";
export const CAS_LOGIN_URL = BASE_URL + "/login";

export function User() {
  return {
    "user": BASE_URL + '/user'
  }
}

export function Student() {
  const str = "/student";
  return {
    "groups": BASE_URL + str + '/groups',
    "works_undone": BASE_URL + str + '/works/un_done',
    "works_done": BASE_URL + str + '/works/done',
    "upload": BASE_URL + str + '/upload/',
    "addGroup": BASE_URL + str + '/group',
    "dropOutGroup": BASE_URL + str + '/group/',
    "uploadWork": BASE_URL + str + '/work/',
    "deleteUpload": BASE_URL + str + '/work/',
    "existGroup": BASE_URL + str + '/group/exist'
  }
}

export function Teacher() {
  const str = "/teacher";
  return {
    "existGroup": BASE_URL + str + '/group/exist',
    "createGroup": BASE_URL + str + '/group'
  }
}
