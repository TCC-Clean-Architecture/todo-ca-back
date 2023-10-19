import { expect } from 'chai'

import { type IUser } from '@/entities/interfaces/user'
import { InMemoryUserRepository } from '@/usecases/shared/repository/in-memory-user-repository'
import { CreateUserUseCase } from '@/usecases/user/create-user'
import { CreateUserController } from '@/web-controllers/user/create-user-controller'

describe('Create user controller testing', () => {
  it('should return success', async () => {
    const user: IUser = {
      email: 'email@email.com',
      password: 'Password100'
    }
    const repository = new InMemoryUserRepository([])
    const useCase = new CreateUserUseCase(repository)
    const controller = new CreateUserController(useCase)
    const response = await controller.handler({
      body: user
    })
    expect(response.description).to.equal('User created successfully')
    expect(response.statusCode).to.equal(200)
    expect(response.message).to.equal('OK')
    expect(response.type).to.equal('success')
    expect(response.content).to.have.property('_id')
    expect(response.content).to.deep.include({ email: user.email })
    expect(response.content).to.not.have.property('password')
  })
  it('should return fail', async () => {
    const user: IUser = {
      email: 'emailemail.com',
      password: 'Password100'
    }
    const repository = new InMemoryUserRepository([])
    const useCase = new CreateUserUseCase(repository)
    const controller = new CreateUserController(useCase)
    const response = await controller.handler({
      body: user
    })
    console.log(response.content)
    expect(response.description).to.equal('Error on create user')
    expect(response.statusCode).to.equal(400)
    expect(response.message).to.equal('Bad Request')
    expect(response.type).to.equal('error')
    expect(response.content).to.deep.equal({
      message: 'Invalid email: emailemail.com.'
    })
  })
})
