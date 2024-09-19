import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const Axios = axios.create({
baseURL: process.env.EXPO_PUBLIC_HOST,
headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});


Axios.interceptors.request.use(async(config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

Axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);