import { type ITodoWithId } from '@/entities/interfaces/todo'

interface IObjectWithId {
  id: string
  [key: string]: any
}

interface IObjectWith_Id {
  _id: string
  [key: string]: any
}

const idConverter = (objWithId: IObjectWithId): IObjectWith_Id => {
  const { id, ...rest } = objWithId
  if (objWithId.todos?.length) {
    const todos = objWithId.todos.map((todo: ITodoWithId) => {
      const { id: todoId, ...todoRest } = todo
      return {
        _id: todoId,
        ...todoRest
      }
    })
    return {
      _id: id,
      ...rest,
      todos
    }
  }
  return {
    _id: id,
    ...rest
  }
}

export { idConverter }
