import { assert } from 'chai'
import { responseFactory } from '../../../factories'
import { type IResponseFactoryPayload } from '../../../interfaces'

describe('Response message factory testing', () => {
  it('should create success 200 response message instance', () => {
    const responsePayload: IResponseFactoryPayload = {
      statusCode: 200,
      description: 'This is success response description',
      content: {
        ok: true
      }
    }
    const todoInstance = responseFactory(responsePayload)
    const expectedResponseBody = {
      ...responsePayload,
      type: 'success',
      message: 'OK'
    }
    assert.deepEqual(todoInstance, expectedResponseBody)
  })
  const errorTests = [
    { statusCode: 400, message: 'Bad Request' },
    { statusCode: 401, message: 'Unauthorized' },
    { statusCode: 403, message: 'Forbidden' },
    { statusCode: 404, message: 'Not Found' }
  ]
  errorTests.forEach(testPayload => {
    it(`should create error response ${testPayload.message} message instance`, () => {
      const responsePayload: IResponseFactoryPayload = {
        statusCode: testPayload.statusCode,
        description: 'This is error response description',
        content: {
          ok: false
        }
      }
      const todoInstance = responseFactory(responsePayload)
      const expectedResponseBody = {
        ...responsePayload,
        type: 'error',
        message: testPayload.message
      }
      assert.deepEqual(todoInstance, expectedResponseBody)
    })
  })
  it('should return 500 for default', () => {
    const responsePayload: IResponseFactoryPayload = {
      statusCode: 500,
      description: 'This is success response description',
      content: {
        ok: true
      }
    }
    const todoInstance = responseFactory(responsePayload)
    const expectedResponseBody = {
      ...responsePayload,
      type: 'error',
      message: 'Internal Server Error'
    }
    assert.deepEqual(todoInstance, expectedResponseBody)
  })
})
