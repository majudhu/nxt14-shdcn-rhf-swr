import axios from 'axios';
import { BASE_URL } from './api-types';

export const axiosClient = axios.create({ baseURL: BASE_URL });
