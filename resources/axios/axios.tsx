import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';

export const Axios = axios.create({
baseURL:process.env.EXPO_PUBLIC_HOST, // + 'http://192.168.0.7:3000' ,
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
    if (error.status === 401) {
      router.replace('/(auths)/');
    }
    return Promise.reject(error);
  }
);