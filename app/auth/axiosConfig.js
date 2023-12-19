
import axios from 'axios';
import authStorage from './storage';

axios.interceptors.request.use(
  async (config) => {
    const token = await authStorage.getToken("_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
