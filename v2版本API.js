'use strict';
export const BASE_URL = "http://itning:8888";
export const CAS_LOGIN_URL = BASE_URL + "/v2/user/login";
export const CAS_LOGOUT_URL = BASE_URL + "/v2/user/logout";
const str = "/v2";

export function Student() {
  return {
    groups: BASE_URL + str + '/student_group',
    works_undone: BASE_URL + str + '/work/un_done',
    works_done: BASE_URL + str + '/work/done',
    upload: BASE_URL + str + '/upload/',
    addGroup: BASE_URL + str + '/student_group',
    dropOutGroup: BASE_URL + str + '/student_group/',
    uploadWork: BASE_URL + str + '/file/up/',
    deleteUpload: BASE_URL + str + '/upload/',
    existGroup: BASE_URL + str + '/student_group/exist',
    downWork: BASE_URL + str + '/file/down/',
    downPreview: BASE_URL + str + '/down_preview/',
    notices: BASE_URL + str + '/notice',
    getReview: BASE_URL + str + '/upload/review/',
    delNotice: BASE_URL + str + '/notice/',
  }
}

export function Teacher() {
  return {
    groups: BASE_URL + str + '/group',
    existGroup: BASE_URL + str + '/group/exist',
    createGroup: BASE_URL + str + '/group',
    delGroup: BASE_URL + str + '/group/',
    upGroupName: BASE_URL + str + '/group/',
    works: BASE_URL + str + '/work/works',
    work: BASE_URL + str + '/work/',
    createWork: BASE_URL + str + '/work',
    delWork: BASE_URL + str + '/work/',
    upWorkEnabled: BASE_URL + str + '/work/enabled/',
    upWorkName: BASE_URL + str + '/work/name/',
    workDetail: BASE_URL + str + '/work/detail/',
    pack: BASE_URL + str + '/pack/',
    downAll: BASE_URL + str + '/down/',
    downNow: BASE_URL + str + '/file/down_now/',
    downInZip: BASE_URL + str + '/down_in_zip/',
    zipPreview: BASE_URL + str + '/zip_preview/',
    reviewWork: BASE_URL + str + '/review/',
    getReviewWork: BASE_URL + str + '/upload/review/',
  }
}
