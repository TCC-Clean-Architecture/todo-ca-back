type HttpResponseType = 'success' | 'error'

export interface IHttpResponseBody<T = object> {
  statusCode: number
  type: HttpResponseType
  message: string
  description: string
  content: T
}

export interface IHttpResponse<T = object> {
  statusCode: number
  body: IHttpResponseBody<T>
}
