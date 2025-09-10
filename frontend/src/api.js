import axios from 'axios'

const API_BASE = 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_BASE,
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}
