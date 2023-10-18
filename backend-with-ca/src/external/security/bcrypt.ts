import bcrypt from 'bcrypt'

import { type IHashRepository } from '@/shared/security-repository'

class Bcrypt implements IHashRepository {
  async hash (value: string): Promise<string> {
    const result = await bcrypt.hash(value, 10)
    return result
  }

  async compare (data: string, encrypted: string): Promise<boolean> {
    const result = await bcrypt.compare(data, encrypted)
    return result
  }
}

export {
  Bcrypt
}
