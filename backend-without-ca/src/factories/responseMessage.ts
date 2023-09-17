import { type IResponseBody, type IResponseFactoryPayload } from '../interfaces'

function messageBuilder (statusCode: number): string {
  switch (statusCode) {
    case 200:
      return 'OK'
    case 400:
      return 'Bad Request'
    case 404:
      return 'Not Found'
    default:
      return 'Internal Server Error'
  }
}

const responseFactory = (payload: IResponseFactoryPayload): IResponseBody => {
  const sC = payload.statusCode

  return {
    statusCode: payload.statusCode,
    type: (sC >= 200 && sC < 300) ? 'success' : 'error',
    message: messageBuilder(sC),
    description: payload.description,
    content: payload.content
  }
}

export { responseFactory }
