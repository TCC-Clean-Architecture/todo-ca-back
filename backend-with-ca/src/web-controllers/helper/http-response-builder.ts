import { type IHttpResponse } from '../port/http-response'

interface IHttpResponsePayload {
  description: string
  content: object
}

const ok = ({ description, content }: IHttpResponsePayload): IHttpResponse => ({
  statusCode: 200,
  message: 'OK',
  type: 'success',
  description,
  content
})

const badRequest = ({ description, content }: IHttpResponsePayload): IHttpResponse => ({
  statusCode: 400,
  message: 'Bad Request',
  type: 'error',
  description,
  content
})

export { ok, badRequest }
