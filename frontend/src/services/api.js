import axios from "axios";

const API = axios.create({
  baseURL: "http://13.60.196.241:10000/api"
});

export default API;