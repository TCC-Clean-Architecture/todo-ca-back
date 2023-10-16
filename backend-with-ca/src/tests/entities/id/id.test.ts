import { expect } from 'chai'

import { Id } from '@/entities/id/id'

describe('Testing instance of id', () => {
  describe('Test create method', () => {
    it('should create new id', () => {
      const id = Id.create()
      expect(id.value).to.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
    })
    it('should create id if has parameter', () => {
      const id = 'a1179366-1b68-4db0-baff-3e98337cdad7'
      const instance = Id.create(id)
      expect(instance.value).to.equal(id)
    })
  })

  describe('Test validate method', () => {
    it('should validate and return true', () => {
      const idValidation = Id.validate('15c31ce1-ed63-49a1-b8e3-cd02e7ffebac')
      expect(idValidation).to.equal(true)
    })
    it('should validate and return false', () => {
      const idValidation = Id.validate('thisisnotid')
      expect(idValidation).to.equal(false)
    })
    it('should return false when the parameter is not string', () => {
      const id = 123456 as unknown as string
      const idValidation = Id.validate(id)
      expect(idValidation).to.equal(false)
    })
  })
})
