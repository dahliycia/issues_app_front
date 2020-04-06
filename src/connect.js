const axios = require('axios');

const API_PORT = process.env.API_PORT || 8001;
const API_HOST = process.env.API_HOST || 'localhost'

export const get = (url) => {
  return axios.get(`http://${API_HOST}:${API_PORT}${url}`)
    .then(result => {
      return result.data;
    })
    .catch((e) => {
      console.log(e)
      return {error: e}
    })
}

export const post = (url, body) => {
  return axios.post(`http://${API_HOST}:${API_PORT}${url}`, body)
    .then(result => {
      return result.data;
    })
    .catch((e) => {
      console.log(e)
      return {error: e}
    })
}

export default {
  post: post,
  get: get
}