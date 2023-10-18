import { expect } from 'chai'

import { InvalidTokenError } from '@/external/security/error/InvalidTokenError'
import { Jwt } from '@/external/security/jwt'

describe('Jwt testing', () => {
  it('should sign using jwt and verify', () => {
    const payload = {
      userId: 'thisisuserid'
    }
    const jwtInstance = new Jwt('abcde')
    const jwt = jwtInstance.sign(payload)
    const jwtResult = jwtInstance.verify(jwt)
    expect(jwtResult.isRight()).to.equal(true)
    expect(jwtResult.value).to.deep.include(payload)
  })
  it('should fail verify using jwt', () => {
    const jwtInstance = new Jwt('abcde')
    const jwtResult = jwtInstance.verify('abcde')
    expect(jwtResult.isLeft()).to.equal(true)
    expect(jwtResult.value).to.be.instanceOf(InvalidTokenError)
  })
})
