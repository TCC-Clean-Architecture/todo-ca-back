export interface IHashRepository {
  hash(value: string): Promise<string>
  compare(data: string, encrypted: string): Promise<boolean>
}
