import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: '/api/', //process.env.NEXT_PUBLIC_API_URL
});
