import request from 'supertest'
import app from './app'

describe('API Gateway Health', () => {
  it('GET /api/health should return healthy status', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('status', 'healthy')
    expect(res.body).toHaveProperty('timestamp')
  })
})
