import axios from 'axios';

export const Axios = axios.create({
baseURL: process.env.EXPO_PUBLIC_HOST,
headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});
