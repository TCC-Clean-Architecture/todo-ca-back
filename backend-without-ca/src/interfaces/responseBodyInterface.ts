type ResponseType = 'success' | 'error'
type ResponseContent = object

interface IResponseBody {
  statusCode: number
  type: ResponseType
  message: string
  description: string
  content: ResponseContent
}

interface IResponseFactoryPayload extends Omit<IResponseBody, 'type' | 'message'> {}

export type { ResponseContent, IResponseBody, IResponseFactoryPayload }
