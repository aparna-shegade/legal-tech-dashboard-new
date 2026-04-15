import axios from "axios";

const API = axios.create({
  baseURL: "https://legal-tech-backend-5klx.onrender.com"
});

export default API;