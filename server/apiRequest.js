import axios from 'axios'

import { configs } from './configs.js'

const apiRequest = axios.create({
  baseURL: configs.apiUrl,
})

apiRequest.interceptors.response.use(
  (response) => Promise.resolve(response.data),
  (error) => Promise.reject(error.response.data)
)
export default apiRequest
