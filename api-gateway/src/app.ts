import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Pool } from 'pg'
import { createClient } from 'redis'
import axios from 'axios'
import client from 'prom-client'

dotenv.config()

const app = express()
const OPT_OUT_DOMAINS = (process.env.OPT_OUT_DOMAINS || '')
  .split(',')
  .map(d => d.trim().toLowerCase())
  .filter(Boolean)

const RATE_LIMIT_DELAY_MS = Number(process.env.RATE_LIMIT_DELAY_MS || 2000)
const domainNextAllowed: Record<string, number> = {}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

const REDIS_URL = process.env.REDIS_URL
const redis = REDIS_URL ? createClient({ url: REDIS_URL }) : null
if (redis) {
  redis.on('error', (err) => console.warn('Redis error:', err))
  redis.connect().catch(err => console.warn('Redis não disponível, cache desativado:', err))
}


app.use(cors())
app.use(express.json())


client.collectDefaultMetrics()
app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', client.register.contentType)
    res.end(await client.register.metrics())
  } catch (err) {
    res.status(500).send('error collecting metrics')
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

app.get('/api/summary', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      WITH recent AS (
        SELECT success, status_code, response_time_ms
        FROM api_metrics
        WHERE timestamp > NOW() - INTERVAL '24 hours'
      )
      SELECT
        (SELECT COUNT(*) FROM recent) AS total,
        (SELECT COUNT(*) FROM recent WHERE success = true) AS success,
        (SELECT COUNT(*) FROM recent WHERE success = false OR status_code >= 400) AS errors,
        (SELECT COALESCE(AVG(response_time_ms), 0) FROM recent) AS avg_response
    `)
    const r = rows[0] || { total: 0, success: 0, errors: 0, avg_response: 0 }
    const successRate = r.total ? (r.success / r.total) : 0
    const errorRate = r.total ? (r.errors / r.total) : 0

    const LATENCY_THRESHOLD_MS = Number(process.env.ALERT_THRESHOLD_MS || 1000)
    const ERROR_RATE_THRESHOLD = Number(process.env.ERROR_RATE_THRESHOLD || 0.2)
    const alerts: { message: string; level: 'warning' | 'critical' }[] = []
    if (r.avg_response >= LATENCY_THRESHOLD_MS) {
      alerts.push({ message: `Latência média alta: ${Math.round(r.avg_response)}ms`, level: 'warning' })
    }
    if (errorRate >= ERROR_RATE_THRESHOLD) {
      alerts.push({ message: `Taxa de erro elevada: ${(errorRate * 100).toFixed(2)}%`, level: 'critical' })
    }

    res.json({
      total: r.total,
      successRate: Number((successRate * 100).toFixed(2)),
      errorRate: Number((errorRate * 100).toFixed(2)),
      avgResponse: Number(r.avg_response.toFixed(2)),
      alerts
    })
  } catch (err) {
    console.error('Error summary:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/distribution', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        SUM(CASE WHEN status_code BETWEEN 200 AND 299 THEN 1 ELSE 0 END) AS s2xx,
        SUM(CASE WHEN status_code BETWEEN 300 AND 399 THEN 1 ELSE 0 END) AS s3xx,
        SUM(CASE WHEN status_code BETWEEN 400 AND 499 THEN 1 ELSE 0 END) AS s4xx,
        SUM(CASE WHEN status_code >= 500 THEN 1 ELSE 0 END) AS s5xx
      FROM api_metrics
      WHERE timestamp > NOW() - INTERVAL '24 hours'
    `)
    const r = rows[0] || { s2xx: 0, s3xx: 0, s4xx: 0, s5xx: 0 }
    res.json({
      distribution: {
        '2xx': Number(r.s2xx),
        '3xx': Number(r.s3xx),
        '4xx': Number(r.s4xx),
        '5xx': Number(r.s5xx)
      }
    })
  } catch (err) {
    console.error('Error distribution:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/percentiles', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        percentile_disc(0.5) WITHIN GROUP (ORDER BY response_time_ms) AS p50,
        percentile_disc(0.9) WITHIN GROUP (ORDER BY response_time_ms) AS p90,
        percentile_disc(0.95) WITHIN GROUP (ORDER BY response_time_ms) AS p95,
        percentile_disc(0.99) WITHIN GROUP (ORDER BY response_time_ms) AS p99
      FROM api_metrics
      WHERE timestamp > NOW() - INTERVAL '24 hours'
    `)
    const r = rows[0] || { p50: 0, p90: 0, p95: 0, p99: 0 }
    res.json({ percentiles: {
      p50: Number(r.p50 || 0),
      p90: Number(r.p90 || 0),
      p95: Number(r.p95 || 0),
      p99: Number(r.p99 || 0)
    } })
  } catch (err) {
    console.error('Error percentiles:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/over-time', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      WITH buckets AS (
        SELECT 
          date_trunc('minute', timestamp) AS bucket,
          AVG(response_time_ms) AS avg_response,
          SUM(CASE WHEN success = false OR status_code >= 400 THEN 1 ELSE 0 END) AS error_count,
          COUNT(*) AS total
        FROM api_metrics
        WHERE timestamp > NOW() - INTERVAL '24 hours'
        GROUP BY 1
      )
      SELECT bucket, avg_response, 
             CASE WHEN total > 0 THEN (error_count::decimal / total) ELSE 0 END AS error_rate
      FROM buckets
      ORDER BY bucket ASC
    `)
    res.json(rows.map((r: any) => ({
      timestamp: r.bucket,
      avg_response_time_ms: Number(r.avg_response || 0),
      error_rate: Number((r.error_rate || 0).toFixed(4))
    })))
  } catch (err) {
    console.error('Error over-time:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/metrics', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM api_metrics ORDER BY timestamp DESC LIMIT 100'
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching metrics:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/proxy', async (req, res) => {
  try {
    const url = (req.query.url as string) || ''
    if (!url) return res.status(400).json({ error: 'url param required' })
    const allowed = /^https?:\/\//i.test(url)
    if (!allowed) return res.status(400).json({ error: 'only http/https urls allowed' })

    let hostname = ''
    try { hostname = new URL(url).hostname.toLowerCase() } catch {}
    if (hostname && OPT_OUT_DOMAINS.includes(hostname)) {
      return res.status(403).json({ error: 'domain opted-out', domain: hostname })
    }

    if (hostname) {
      const now = Date.now()
      const nextAllowed = domainNextAllowed[hostname] || 0
      if (now < nextAllowed) {
        await delay(nextAllowed - now)
      }
      domainNextAllowed[hostname] = Date.now() + RATE_LIMIT_DELAY_MS
    }

    const timeoutMs = Number(process.env.PROXY_TIMEOUT_MS || 8000)
    const start = Date.now()

    let methodUsed: 'HEAD' | 'GET' = 'HEAD'
    let response
    try {
      response = await axios.head(url, {
        timeout: timeoutMs,
        validateStatus: () => true,
        headers: {
          'User-Agent': 'API-Monitor-Dashboard/1.0',
          'Accept': 'application/json, text/plain, application/xml;q=0.9'
        }
      })
    } catch {

      methodUsed = 'GET'
      response = await axios.get(url, {
        timeout: timeoutMs,
        validateStatus: () => true,
        responseType: 'text',
        transformResponse: [(data) => data], 
        headers: {
          'User-Agent': 'API-Monitor-Dashboard/1.0',
          'Accept': 'application/json, text/plain, application/xml;q=0.9'
        }
      })
    }

    const durationMs = Date.now() - start
    const rawHeaders = response.headers || {}
    const contentType = rawHeaders['content-type'] || ''


    const headers: Record<string, string> = {}
    Object.keys(rawHeaders).forEach(k => {
      const lower = k.toLowerCase()
      if (['set-cookie', 'cookie', 'authorization'].includes(lower)) return
      const v = (rawHeaders as any)[k]
      if (typeof v === 'string') headers[lower] = v
    })


    const isHtml = /text\/html/i.test(contentType)
    const isJson = /application\/json/i.test(contentType)
    const isXml = /application\/(xml|rss\+xml)|text\/xml/i.test(contentType)

    let contentLength = 0
    if (typeof rawHeaders['content-length'] === 'string') {
      contentLength = Number(rawHeaders['content-length']) || 0
    } else if (methodUsed === 'GET') {

      const body = response.data
      if (typeof body === 'string') {
        contentLength = Buffer.byteLength(body)
      } else if (body != null) {
        try { contentLength = Buffer.byteLength(JSON.stringify(body)) } catch { contentLength = 0 }
      }
    }

    const payload = {
      request: { url, methodUsed },
      status: response.status,
      durationMs,
      contentType,
      contentLength,
      headers,
      bodyReturned: false,
      refusedContent: isHtml ? true : false,
      retryAfter: response.headers?.['retry-after'] || undefined
    }

    res.json(payload)
  } catch (error: any) {
    const status = error?.response?.status || 500
    res.status(200).json({ status, error: true, message: error?.message || 'proxy error' })
  }
})

export default app