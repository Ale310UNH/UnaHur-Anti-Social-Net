import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'

console.log('API Base URL:', BASE)

export const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' }
})

