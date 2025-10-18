import axios from "axios";

const API_BASE_URL = "http://www.manosamigas.somee.com/"; //"https://localhost:51491/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
