import request from 'supertest'
import app from '../../main/configs/express'
import { expect } from 'chai'

describe('Health check routes testing', () => {
  it('should execute health-check route successfully', async () => {
    const response = await request(app).get('/health')
    expect(response.statusCode).to.equal(200)
    expect(response.body).to.have.property('uptime')
    expect(response.body).to.have.property('message')
    expect(response.body).to.have.property('timestamp')
  })
  it('should create a new todo', async () => {
    const todo = {
      name: 'teste',
      description: 'this is description',
      status: 'done'
    }
    const response = await request(app).post('/todos').send(todo)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content).to.deep.include(todo)
  })
})
