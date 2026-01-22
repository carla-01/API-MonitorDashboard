import axios from 'axios'

export type ProxyResponse = {
  status: number
  durationMs?: number
  contentType?: string
  contentLength?: number
  refusedContent?: boolean
  headers?: Record<string, string>
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function fetchProxy(url: string): Promise<ProxyResponse> {
  const { data } = await axios.get(`${API_BASE_URL}/proxy`, { params: { url } })
  return data as ProxyResponse
}
