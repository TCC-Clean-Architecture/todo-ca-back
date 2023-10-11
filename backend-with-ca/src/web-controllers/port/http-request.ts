export interface IHttpRequest<T = object, U = object> {
  body?: T
  params?: U
}
