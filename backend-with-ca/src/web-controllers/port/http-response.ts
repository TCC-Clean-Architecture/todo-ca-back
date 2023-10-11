type HttpResponseType = 'success' | 'error'

export interface IHttpResponseBody<T> {
  statusCode: number
  type: HttpResponseType
  message: string
  description: string
  content: T
}

export interface IHttpResponse<T> {
  statusCode: number
  body: IHttpResponseBody<T>
}
