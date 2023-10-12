import request from 'supertest'
import app from '../../main/server'
import { expect } from 'chai'

describe('Health check routes testing', () => {
  it('should execute health-check route successfully', async () => {
    const response = await request(app).get('/health')
    expect(response.statusCode).to.equal(200)
    expect(response.body).to.have.property('uptime')
    expect(response.body).to.have.property('message')
    expect(response.body).to.have.property('timestamp')
  })
})
