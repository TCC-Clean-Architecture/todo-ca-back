interface ITodoCreate {
  name: string
  description: string
  status: 'todo' | 'inprogress' | 'done'
}

interface ITodoCreated extends ITodoCreate {
  createdAt: Date
}

export type { ITodoCreate, ITodoCreated }
