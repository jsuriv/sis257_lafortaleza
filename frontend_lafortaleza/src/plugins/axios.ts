import axios from 'axios'
import { getTokenFromLocalStorage } from '@/helpers'

const API_URL = import.meta.env.VITE_BASE_URL_ENDPOINT || 'http://127.0.0.1:3000/api/v1/'

const axiosInstance = axios.create({
  baseURL: API_URL,
})

axiosInstance.interceptors.request.use((config) => {
  const token = getTokenFromLocalStorage()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInstance
