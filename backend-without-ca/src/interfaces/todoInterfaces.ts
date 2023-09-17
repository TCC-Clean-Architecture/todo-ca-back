interface ITodoPayload {
  name: string
  description: string
  status: 'todo' | 'inprogress' | 'done'
}

interface ITodoCreated extends ITodoPayload {
  createdAt: Date
}

export type { ITodoPayload, ITodoCreated }
