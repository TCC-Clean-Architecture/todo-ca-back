import * as yup from 'yup'
import { type Id, type ITodoList, type ITodoListBeforeInsert } from '../interfaces'

const yupValidation = yup.object({
  name: yup.string().min(1).required(),
  todos: yup.array().of(
    yup.object({
      _id: yup.string().required(),
      name: yup.string().min(1).required(),
      description: yup.string().min(1).required(),
      status: yup.string().oneOf(['todo', 'inprogress', 'done']).required(),
      createdAt: yup.date().required()
    })
  )
})

const todoListFactory = (todoListPayload: ITodoList, userId: Id): ITodoListBeforeInsert | Error => {
  try {
    yupValidation.validateSync(todoListPayload)
    return {
      name: todoListPayload.name,
      todos: todoListPayload.todos ? todoListPayload.todos : [],
      userId,
      createdAt: new Date()
    }
  } catch (err: any) {
    return new Error(`Error on create todo list instance: ${err.errors.join(' | ')}`)
  }
}

export { todoListFactory }
