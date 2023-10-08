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
}

export {
  availableStatus,
  type ITodo
}
