import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function fetchProxy(url: string) {
  const { data } = await axios.get(`${API_BASE_URL}/proxy`, { params: { url } })
  return data
}
