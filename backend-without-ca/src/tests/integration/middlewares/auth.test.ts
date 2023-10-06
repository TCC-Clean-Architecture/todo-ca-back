import request from 'supertest'
import { server } from '../../../server'
import { assert } from 'chai'

describe('Auth middleware testing', () => {
  it('should return an 403 error', async () => {
    const response = await request(server).post('/todos/lists')
    assert.deepEqual(response.body, {
      statusCode: 403,
      type: 'error',
      message: 'Forbidden',
      description: 'A token is required for authentication',
      content: {}
    })
  })
  it('should return an 401 error', async () => {
    const response = await request(server).post('/todos/lists').set('x-access-token', 'thisistoken')
    assert.deepEqual(response.body, {
      statusCode: 401,
      type: 'error',
      message: 'Unauthorized',
      description: 'Invalid Token',
      content: {}
    })
  })
})
