import request from 'supertest'
import { server } from '../../../server'
import { assert } from 'chai'

describe('GET /todos testing', () => {
  it('should return 200 with value', async () => {
    const response = await request(server).get('/health')
    assert.strictEqual(response.statusCode, 200)
    assert.exists(response.body.uptime)
    assert.exists(response.body.message)
    assert.exists(response.body.timestamp)
  })
})
