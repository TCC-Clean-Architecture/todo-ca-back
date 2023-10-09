enum AvailableStatusEnum {
  todo,
  inprogress,
  done
}

export type AvailableStatus = keyof typeof AvailableStatusEnum

const availableStatus = Object.values(AvailableStatusEnum)

interface ITodo {
  name: string
  description: string
  status: AvailableStatus
  createdAt?: Date
}

export {
  availableStatus,
  type ITodo
}
