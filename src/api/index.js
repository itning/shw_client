'use strict';
export const BASE_URL = "http://localhost:8080";
export const CAS_LOGIN_URL = BASE_URL + "/login";

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
    "existGroup": BASE_URL + str + '/group/exist',
    "downWork": BASE_URL + str + '/down/',
    "downPreview": BASE_URL + str + '/down_preview/',
  }
}

export function Teacher() {
  const str = "/teacher";
  return {
    'groups': BASE_URL + str + '/groups',
    "existGroup": BASE_URL + str + '/group/exist',
    "createGroup": BASE_URL + str + '/group',
    "delGroup": BASE_URL + str + '/group/',
    "upGroupName": BASE_URL + str + '/group/',
    "works": BASE_URL + str + '/works',
    "work": BASE_URL + str + '/work/',
    "createWork": BASE_URL + str + '/work',
    "delWork": BASE_URL + str + '/work/',
    "upWork": BASE_URL + str + '/work/',
    "workDetail": BASE_URL + str + '/work_detail/',
    "pack": BASE_URL + str + '/pack/',
    "downAll": BASE_URL + str + '/down/',
    "downNow": BASE_URL + str + '/down_now/',
  }
}
