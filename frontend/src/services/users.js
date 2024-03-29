import http from './http';

const route = '/users';

function register(data) {
  //console.log(data)
  return http.post(`${route}/register`, data);
}

function reset(data) {
  return http.post(`${route}/reset`, data);
}

function update(data) {
  return http.put(`${route}/update`, data);
}

function getChildren() {
  return http.get(`${route}/children`);
}

function getAllChildren() {
  return http.get(`${route}/children/all`);
}

const methods = { register, reset, update, getChildren, getAllChildren };
export default methods;
