import * as yup from 'yup'
import bcrypt from 'bcrypt'
import { type IUser } from '../interfaces'

const yupValidation = yup.object({
  name: yup.string().min(1).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required()
})

const userFactory = (user: IUser): IUser | Error => {
  try {
    yupValidation.validateSync(user)
    return {
      name: user.name,
      email: user.email,
      password: bcrypt.hashSync(user.password, 10)
    }
  } catch (err: any) {
    return new Error(`Error on create user instance: ${err.errors.join(' | ')}`)
  }
}

export { userFactory }
