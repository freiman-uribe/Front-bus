import axios from 'axios';

export const Axios = axios.create({
baseURL: process.env.EXPO_PUBLIC_HOST,
headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});


// Axios.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );