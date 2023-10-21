import { expect } from 'chai'

import { Bcrypt } from '@/external/security/bcrypt'

describe('Bcrypt testing', () => {
  it('should hash and compare', async () => {
    const bcryptInstance = new Bcrypt()
    const value = 'thisisvalue'
    const hashedValue = await bcryptInstance.hash(value)
    const result = await bcryptInstance.compare(value, hashedValue)
    expect(result).to.equal(true)
  })
})
