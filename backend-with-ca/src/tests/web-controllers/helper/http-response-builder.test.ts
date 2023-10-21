import { expect } from 'chai'

import { badRequest, forbidden, ok, unauthorized } from '@/web-controllers/helper/http-response-builder'
import { type IHttpResponse } from '@/web-controllers/port/http-response'

describe('Http Response builder testing', () => {
  it('should create 200 ok response', () => {
    const response = ok({
      description: 'sunda',
      content: {}
    })

    const expectedResponse: IHttpResponse = {
      statusCode: 200,
      message: 'OK',
      type: 'success',
      description: 'sunda',
      content: {}
    }
    expect(response).to.deep.equal(expectedResponse)
  })

  it('should create 400 bad request response', () => {
    const response = badRequest({
      description: 'sunda',
      content: {}
    })

    const expectedResponse: IHttpResponse = {
      statusCode: 400,
      message: 'Bad Request',
      type: 'error',
      description: 'sunda',
      content: {}
    }
    expect(response).to.deep.equal(expectedResponse)
  })

  it('should create 403 forbidden response', () => {
    const response = forbidden({
      description: 'sunda',
      content: {}
    })

    const expectedResponse: IHttpResponse = {
      statusCode: 403,
      message: 'Forbidden',
      type: 'error',
      description: 'sunda',
      content: {}
    }
    expect(response).to.deep.equal(expectedResponse)
  })

  it('should create 401 unauthorized response', () => {
    const response = unauthorized({
      description: 'sunda',
      content: {}
    })

    const expectedResponse: IHttpResponse = {
      statusCode: 401,
      message: 'Unauthorized',
      type: 'error',
      description: 'sunda',
      content: {}
    }
    expect(response).to.deep.equal(expectedResponse)
  })
})
