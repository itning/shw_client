'use strict';
const BASE_URL = "http://localhost:8080";

export function Student() {
  const str = "/student";
  return {
    "groups": BASE_URL + str + '/groups',
  }
}
