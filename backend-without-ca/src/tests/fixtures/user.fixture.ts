import { faker } from '@faker-js/faker'
import { type Id, type IUser, type IUserInserted } from '../../interfaces'

interface IUserFixturePayload extends Partial<IUser> {
  _id?: Id
}

const userFixture = (user: IUserFixturePayload): Required<IUserInserted> => {
  return {
    _id: user._id ? user._id : faker.string.uuid(),
    name: user.name ? user.name : faker.person.fullName(),
    email: user.email ? user.email : faker.internet.email(),
    password: user.password ? user.password : faker.internet.password()
  }
}

export {
  userFixture
}
