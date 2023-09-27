import axios from 'axios'

import { getAxiosErrorMessage } from 'utils/helpers/handleError'

const requester = axios.create({
  baseURL: import.meta.env.VITE_API,
  timeout: 300000,
})

requester.interceptors.response.use(
  (response) => response,
  (error) => {
    throw new Error(getAxiosErrorMessage(error))
  }
)

export default requester
