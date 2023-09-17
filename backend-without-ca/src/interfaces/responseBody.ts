type ResponseType = 'success' | 'error'
type Content = object

interface IResponseBody {
  statusCode: number
  type: ResponseType
  message: string
  description: string
  content: Content
}

interface IResponseFactoryPayload extends Omit<IResponseBody, 'type' | 'message'> {}

export type { Content, IResponseBody, IResponseFactoryPayload }
