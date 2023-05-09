import axios from "axios";

const api = axios.create({
  baseURL: 'https://zeryab-icu-local.ngrok.dev',
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (err) => {
     return Promise.reject(err);
  }
);

export { api };