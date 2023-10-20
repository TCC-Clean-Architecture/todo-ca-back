import { type ITokenData } from '../../../@types/express'

export interface IHttpRequestWithTokenData {
  tokenData: ITokenData
}

export interface IHttpRequestWithBody<B = object> extends IHttpRequestWithTokenData {
  body: B
}

export interface IHttpRequestWithParams<P = object> extends IHttpRequestWithTokenData {
  params: P
}

export interface IHttpRequestWithBodyAndParams<B = object, P = object> extends IHttpRequestWithTokenData {
  body: B
  params: P
}
