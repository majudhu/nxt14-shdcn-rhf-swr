import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/`
    : 'http://localhost:3000/api/',
});
