import axiosInstance from "axios";

const axios = axiosInstance.create({
  baseURL: "https://memint-server.herokuapp.com/",
  // baseURL: 'http://localhost:5000',
});

export default axios;
