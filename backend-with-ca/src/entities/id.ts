import crypto from 'crypto'

class Id {
  public readonly value: string
  constructor (value: string) {
    this.value = value
  }

  static create (): Id {
    return new Id(crypto.randomUUID())
  }

  static validate (id: string): boolean {
    if (typeof id !== 'string') {
      return false
    }
    if (!id.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
      return false
    }
    return true
  }
}

export {
  Id
}
