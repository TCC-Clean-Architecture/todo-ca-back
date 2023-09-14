import { assert } from 'chai'
import { chooseRepositoryByEnvironment } from '../../../utils/repositoryByEnvironment'

describe('Choose repository by environment testing', () => {
  it('should return memory when environment is test', () => {
    const result = chooseRepositoryByEnvironment('test')
    assert.strictEqual(result, 'memory')
  })
  it('should return mongo when environment is not test', () => {
    const result = chooseRepositoryByEnvironment('dev')
    assert.strictEqual(result, 'mongo')
  })
  it('should return memory when environment is null', () => {
    const result = chooseRepositoryByEnvironment(null)
    assert.strictEqual(result, 'memory')
  })
  it('should return memory when environment is undefined', () => {
    const result = chooseRepositoryByEnvironment(undefined)
    assert.strictEqual(result, 'memory')
  })
})
