import axios from "axios";

const api = axios.create({
  baseURL: 'https://saifshopifytesth.ngrok.io',
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