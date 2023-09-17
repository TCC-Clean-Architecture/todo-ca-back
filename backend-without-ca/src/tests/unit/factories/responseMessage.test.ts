import { assert } from 'chai'
import { responseFactory } from '../../../factories'
import { type IResponseFactoryPayload } from '../../../interfaces'

describe('Response message factory testing', () => {
  it('should create success response message instance', () => {
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

  it('should create error response message instance', () => {
    const responsePayload: IResponseFactoryPayload = {
      statusCode: 400,
      description: 'This is error response description',
      content: {
        ok: false
      }
    }
    const todoInstance = responseFactory(responsePayload)
    const expectedResponseBody = {
      ...responsePayload,
      type: 'error',
      message: 'Bad Request'
    }
    assert.deepEqual(todoInstance, expectedResponseBody)
  })
})
