import axios from "axios";
// import BACKEND_APP_URL from "../config/backendUrl";

const api = axios.create({
  baseURL: "/api/merchant/",
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
