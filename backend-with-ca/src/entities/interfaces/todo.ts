enum AvailableStatusEnum {
  todo,
  inprogress,
  done
}

type AvailableStatus = keyof typeof AvailableStatusEnum

const availableStatus = Object.values(AvailableStatusEnum)

interface ITodo {
  name: string
  description: string
  status: AvailableStatus
  createdAt?: Date
}

interface ICompleteTodo extends Required<ITodo> {

}

interface ITodoWithId extends ICompleteTodo {
  id: string
}

interface IListIdTodoIdParams {
  listId: string
  todoId: string
}

export {
  type AvailableStatus,
  availableStatus,
  type ICompleteTodo,
  type IListIdTodoIdParams,
  type ITodo,
  type ITodoWithId
}
