import dotenv from 'dotenv'

dotenv.config()

export const configs = {
  baseUrl: process.env.VITE_URL,
  apiUrl: process.env.VITE_API,
  imageApiUrl: process.env.VITE_API + '/storage/image',
}
