import axios from 'axios'

// Cliente Axios centralizado para consumo de la API de soporte
export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 8000
})
