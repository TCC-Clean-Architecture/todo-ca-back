import { assert } from 'chai'
import { testFunction } from '../index'

it('should test', () => {
  const result = testFunction()
  assert.strictEqual(result, 'test')
})
