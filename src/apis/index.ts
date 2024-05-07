import axios from 'axios'

import { getAxiosErrorMessage } from 'utils/helpers/handleError'

const requester = axios.create({
  baseURL: import.meta.env.VITE_API,
  timeout: 300000,
  headers: {
    'Access-Control-Max-Age': 600,
  },
})

requester.interceptors.response.use(
  (response) => response,
  (error) => {
    throw new Error(getAxiosErrorMessage(error))
  }
)

export default requester
