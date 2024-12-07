import axios from "axios";
const baseUrl = "/api/persons";
// const baseUrl = "http://localhost:3001/api/persons";// for development purpose

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const update = (id, updatedObj) => {
  console.log(id)
  return axios
    .put(`${baseUrl}/${id}`, updatedObj)
    .then((response) => response.data);
};

export default { getAll, create, remove, update };
