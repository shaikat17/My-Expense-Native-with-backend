import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const axiosInstance = axios.create({
  baseURL: 'http:192.168.1.11:3000/api',
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
